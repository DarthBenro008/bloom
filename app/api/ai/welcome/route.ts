import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { auth } from '@/lib/auth/server';
import { getAITelemetry } from '@/lib/ai/telemetry';

/**
 * GET /api/ai/welcome
 * Generate an onboarding welcome message
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate welcome message using AI
    const result = await generateText({
      model: aiModel,
      system: AI_PROMPTS.ONBOARDING_WELCOME,
      prompt: 'Welcome a new user to Bloom.',
      experimental_telemetry: getAITelemetry('welcome-message', {
        userId: session.data.user.id,
      }),
    });

    return NextResponse.json({ message: result.text.trim() });
  } catch (error) {
    console.error('Error in welcome route:', error);

    return NextResponse.json(
      { error: 'Failed to generate welcome message' },
      { status: 500 }
    );
  }
}
