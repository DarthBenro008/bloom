import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subtasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/subtasks/[id]/toggle
 * Toggle subtask completion
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

    // Get subtask with task info
    const subtask = await db.query.subtasks.findFirst({
      where: eq(subtasks.id, id),
      with: { task: true },
    });

    if (!subtask || subtask.task.userId !== userId) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    }

    // Toggle completion status
    await db
      .update(subtasks)
      .set({ isCompleted: !subtask.isCompleted })
      .where(eq(subtasks.id, id));

    // Revalidate paths
    revalidatePath('/tasks');
    revalidatePath(`/tasks/${subtask.taskId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/subtasks/[id]/toggle:', error);
    return NextResponse.json({ error: 'Failed to toggle subtask' }, { status: 500 });
  }
}
