import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { auth } from '@/lib/auth/server';
import { getAITelemetry } from '@/lib/ai/telemetry';

const MOOD_LABELS: Record<string, string> = {
  great: 'feeling great',
  good: 'feeling good',
  okay: 'feeling okay',
  not_great: 'not feeling great',
  struggling: 'struggling',
};

/**
 * POST /api/ai/mood-response
 * Generate an AI response to user's mood check-in
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mood, note } = body;

    if (!mood) {
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
    }

    // Build context for AI
    const moodLabel = MOOD_LABELS[mood] || mood;
    const userContext = note 
      ? `The user is ${moodLabel}. They shared: "${note}"`
      : `The user is ${moodLabel}.`;

    // Generate AI response
    const result = await generateText({
      model: aiModel,
      system: AI_PROMPTS.MOOD_RESPONSE,
      prompt: userContext,
      experimental_telemetry: getAITelemetry('mood-response', {
        userId: session.data.user.id,
      }),
    });

    return NextResponse.json({ response: result.text.trim() });
  } catch (error) {
    console.error('Error in POST /api/ai/mood-response:', error);
    return NextResponse.json(
      { error: 'Failed to generate mood response' },
      { status: 500 }
    );
  }
}
