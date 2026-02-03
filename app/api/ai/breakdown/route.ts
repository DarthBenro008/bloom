import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { BreakdownRequestSchema, BreakdownSchema } from '@/lib/ai/types';
import { auth } from '@/lib/auth/server';
import { getAITelemetry } from '@/lib/ai/telemetry';

/**
 * POST /api/ai/breakdown
 * Break down a vague task into concrete, actionable subtasks with expected output
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
    const { vagueTask } = BreakdownRequestSchema.parse(body);

    // Generate breakdown using AI
    const result = await generateObject({
      model: aiModel,
      schema: BreakdownSchema,
      system: AI_PROMPTS.TASK_BREAKDOWN,
      prompt: `Break down this task into concrete, actionable steps: "${vagueTask}"

Provide:
1. A list of 2-6 actionable subtasks with effort weights
2. An overall effort level for the entire task
3. A concrete description of what will exist after this task is done`,
      experimental_telemetry: getAITelemetry('task-breakdown', {
        userId: session.data.user.id,
      }),
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('Error in breakdown route:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to break down task' },
      { status: 500 }
    );
  }
}
