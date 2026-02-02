import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { EvaluatePlausibilityRequestSchema, PlausibilitySchema } from '@/lib/ai/types';
import { auth } from '@/lib/auth/server';

/**
 * POST /api/ai/evaluate-plausibility
 * Evaluate the plausibility of a task completion
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { 
      taskTitle, 
      subtasks, 
      effortWeight, 
      completionContract, 
      reflectionResponse 
    } = EvaluatePlausibilityRequestSchema.parse(body);

    // Evaluate plausibility using AI
    const result = await generateObject({
      model: aiModel,
      schema: PlausibilitySchema,
      system: AI_PROMPTS.PLAUSIBILITY_EVALUATION,
      prompt: `Evaluate the plausibility of this task completion:

Task: ${taskTitle}
Subtasks: ${subtasks.join(', ')}
Effort Level: ${effortWeight}
Completion Contract (what user said would exist): ${completionContract}
User's Reflection Response: ${reflectionResponse}

Assess whether real work likely happened.`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('Error in evaluate-plausibility route:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to evaluate plausibility' },
      { status: 500 }
    );
  }
}
