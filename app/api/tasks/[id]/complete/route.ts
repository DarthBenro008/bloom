import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';
import { evaluatePlausibilityDirect } from '@/lib/ai/services';
import { CompleteTaskRequestSchema } from '@/lib/api/types';
import { createOrUpdatePlant, updateGardenHealth } from '@/lib/db/helpers';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/tasks/[id]/complete
 * Complete a task with reflection
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

    // Parse and validate request body
    const body = await request.json();
    const { reflectionResponse } = CompleteTaskRequestSchema.parse(body);

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

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subtaskTitles = task.subtasks.map((st) => st.title);

    // Evaluate plausibility
    const plausibility = await evaluatePlausibilityDirect(
      task.title,
      subtaskTitles,
      task.effortWeight,
      task.completionContract || '',
      reflectionResponse,
      { taskId: id, userId, effortWeight: task.effortWeight }
    );

    // Update task
    await db
      .update(tasks)
      .set({
        status: 'completed',
        reflectionResponse,
        plausibilityScore: plausibility.score,
        plausibilityLevel: plausibility.level,
        completedAt: new Date(),
      })
      .where(eq(tasks.id, id));

    // Update user stats
    await db
      .update(users)
      .set({
        totalTasksCompleted: user.totalTasksCompleted + 1,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Create or update plant based on plausibility
    await createOrUpdatePlant(userId, id, task.effortWeight, plausibility.level);

    // Update garden health based on plausibility
    await updateGardenHealth(userId, plausibility.level);

    // Revalidate paths
    revalidatePath('/tasks');
    revalidatePath(`/tasks/${id}`);
    revalidatePath('/');

    return NextResponse.json({ plausibility });
  } catch (error) {
    console.error('Error in POST /api/tasks/[id]/complete:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 });
  }
}
