import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';

/**
 * GET /api/users/me
 * Get or create current user profile
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.data.user.id;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
      })
      .returning();

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error in GET /api/users/me:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
