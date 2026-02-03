import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { ModifyBreakdownRequestSchema, BreakdownSchema } from '@/lib/ai/types';
import { auth } from '@/lib/auth/server';
import { getAITelemetry } from '@/lib/ai/telemetry';

/**
 * POST /api/ai/modify-breakdown
 * Modify an existing breakdown based on user feedback
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
    const { originalTask, currentBreakdown, userMessage } = ModifyBreakdownRequestSchema.parse(body);

    // Generate modified breakdown using AI
    const result = await generateObject({
      model: aiModel,
      schema: BreakdownSchema,
      system: AI_PROMPTS.MODIFY_BREAKDOWN,
      prompt: `Original task: "${originalTask}"

Current breakdown:
${JSON.stringify(currentBreakdown, null, 2)}

User's modification request: "${userMessage}"

Please provide an updated breakdown that addresses the user's request.`,
      experimental_telemetry: getAITelemetry('modify-breakdown', {
        userId: session.data.user.id,
      }),
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('Error in modify-breakdown route:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to modify breakdown' },
      { status: 500 }
    );
  }
}
