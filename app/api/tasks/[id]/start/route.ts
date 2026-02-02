import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/tasks/[id]/start
 * Start working on a task
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
      .set({ status: 'in_progress' })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));

    // Revalidate paths
    revalidatePath('/tasks');
    revalidatePath(`/tasks/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/tasks/[id]/start:', error);
    return NextResponse.json({ error: 'Failed to start task' }, { status: 500 });
  }
}
