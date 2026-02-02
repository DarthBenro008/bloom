import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';
import { updateGardenHealth } from '@/lib/db/helpers';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/tasks/[id]/abandon
 * Abandon a task
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.data.user.id;
    const { id } = await params;

    // Update task status
    await db
      .update(tasks)
      .set({ status: 'abandoned' })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));

    // Decay garden for abandoned task
    await updateGardenHealth(userId, 'low');

    // Revalidate paths
    revalidatePath('/tasks');
    revalidatePath(`/tasks/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/tasks/[id]/abandon:', error);
    return NextResponse.json({ error: 'Failed to abandon task' }, { status: 500 });
  }
}
