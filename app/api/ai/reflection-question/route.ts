import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { ReflectionQuestionRequestSchema } from '@/lib/ai/types';
import { auth } from '@/lib/auth/server';
import { getAITelemetry } from '@/lib/ai/telemetry';

/**
 * POST /api/ai/reflection-question
 * Generate a reflection question for task completion
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
    const { taskTitle, subtasks, completionContract } = ReflectionQuestionRequestSchema.parse(body);

    // Generate reflection question using AI
    const result = await generateText({
      model: aiModel,
      system: AI_PROMPTS.REFLECTION_QUESTION,
      prompt: `Task: ${taskTitle}
Subtasks completed: ${subtasks.join(', ')}
What the user committed to create: ${completionContract}

Generate a single reflection question for this completed task.`,
      experimental_telemetry: getAITelemetry('reflection-question', {
        userId: session.data.user.id,
      }),
    });

    return NextResponse.json({ question: result.text.trim() });
  } catch (error) {
    console.error('Error in reflection-question route:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate reflection question' },
      { status: 500 }
    );
  }
}
