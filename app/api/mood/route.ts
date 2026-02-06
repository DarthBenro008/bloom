import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { moods } from '@/lib/db/schema';
import { auth } from '@/lib/auth/server';

/**
 * POST /api/mood
 * Submit a mood check-in
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.data.user.id;
    const body = await request.json();
    const { mood, note } = body;

    if (!mood) {
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
    }

    // Generate AI response
    const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/mood-response`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ mood, note }),
    });

    let aiResponseText = 'Thank you for sharing. Your garden appreciates you showing up today.';
    
    if (aiResponse.ok) {
      const data = await aiResponse.json();
      aiResponseText = data.response;
    }

    // Save mood to database
    const [newMood] = await db.insert(moods).values({
      userId,
      mood,
      note: note || null,
      aiResponse: aiResponseText,
    }).returning();

    return NextResponse.json({
      mood: newMood.mood,
      aiResponse: aiResponseText,
    });
  } catch (error) {
    console.error('Error in POST /api/mood:', error);
    return NextResponse.json(
      { error: 'Failed to save mood' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mood
 * Get recent mood check-ins
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.data.user.id;

    // Get recent moods (last 30 days)
    const recentMoods = await db.query.moods.findMany({
      where: (moods, { eq, and, gte }) => 
        and(
          eq(moods.userId, userId),
          gte(moods.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        ),
      orderBy: (moods, { desc }) => [desc(moods.createdAt)],
      limit: 30,
    });

    return NextResponse.json({ moods: recentMoods });
  } catch (error) {
    console.error('Error in GET /api/mood:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moods' },
      { status: 500 }
    );
  }
}
