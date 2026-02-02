import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';
import { generateReflectionQuestionDirect } from '@/lib/ai/services';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/tasks/[id]/initiate-completion
 * Generate reflection question for task completion
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

    // Get task
    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, userId)),
      with: {
        subtasks: {
          orderBy: (subtasks, { asc }) => [asc(subtasks.orderIndex)],
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const subtaskTitles = task.subtasks.map((st) => st.title);

    // Generate reflection question
    const question = await generateReflectionQuestionDirect(
      task.title,
      subtaskTitles,
      task.completionContract || 'Something meaningful'
    );

    // Store the question
    await db
      .update(tasks)
      .set({ reflectionQuestion: question })
      .where(eq(tasks.id, id));

    // Revalidate paths
    revalidatePath(`/tasks/${id}/complete`);

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error in POST /api/tasks/[id]/initiate-completion:', error);
    return NextResponse.json(
      { error: 'Failed to initiate completion' },
      { status: 500 }
    );
  }
}
