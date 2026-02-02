import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { plants, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';

/**
 * GET /api/garden
 * Get user's garden (all plants)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.data.user.id;

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user plants
    const userPlants = await db.query.plants.findMany({
      where: eq(plants.userId, userId),
      with: {
        task: true,
      },
    });

    return NextResponse.json({
      plants: userPlants,
      health: user.gardenHealth,
    });
  } catch (error) {
    console.error('Error in GET /api/garden:', error);
    return NextResponse.json({ error: 'Failed to fetch garden' }, { status: 500 });
  }
}
