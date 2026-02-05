import { NextRequest, NextResponse } from 'next/server';
import { generateText, Output, NoObjectGeneratedError } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { EvaluatePlausibilityRequestSchema, PlausibilitySchema } from '@/lib/ai/types';
import { auth } from '@/lib/auth/server';
import { getAITelemetry } from '@/lib/ai/telemetry';

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
    const result = await generateText({
      model: aiModel,
      output: Output.object({
        name: 'PlausibilityEvaluation',
        description: 'An evaluation of whether a task completion is plausible based on the user\'s reflection',
        schema: PlausibilitySchema,
      }),
      system: AI_PROMPTS.PLAUSIBILITY_EVALUATION,
      prompt: `Evaluate the plausibility of this task completion:

Task: ${taskTitle}
Subtasks: ${subtasks.join(', ')}
Effort Level: ${effortWeight}
Completion Contract (what user said would exist): ${completionContract}
User's Reflection Response: ${reflectionResponse}

Assess whether real work likely happened.`,
      experimental_telemetry: getAITelemetry('plausibility-evaluation', {
        userId: session.data.user.id,
        effortWeight: effortWeight.toString(),
      }),
    });

    return NextResponse.json(result.output);
  } catch (error) {
    console.error('Error in evaluate-plausibility route:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (NoObjectGeneratedError.isInstance(error)) {
      console.error('Failed to generate plausibility evaluation:', {
        cause: error.cause,
        text: error.text,
        response: error.response,
        usage: error.usage,
      });
      return NextResponse.json(
        { error: 'Failed to generate valid plausibility evaluation' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to evaluate plausibility' },
      { status: 500 }
    );
  }
}
