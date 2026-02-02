import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, subtasks, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';
import { CreateTaskRequestSchema } from '@/lib/api/types';
import { revalidatePath } from 'next/cache';

/**
 * GET /api/tasks
 * Get all tasks for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.data.user.id;

    // Get user tasks
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      with: {
        subtasks: {
          orderBy: (subtasks, { asc }) => [asc(subtasks.orderIndex)],
        },
      },
      orderBy: [desc(tasks.createdAt)],
    });

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

/**
 * POST /api/tasks
 * Create a new task with subtasks
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.getSession();
    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.data.user.id;

    // Parse and validate request body
    const body = await request.json();
    const data = CreateTaskRequestSchema.parse(body);

    // Create the task
    const [task] = await db
      .insert(tasks)
      .values({
        userId: userId,
        title: data.title,
        completionContract: data.completionContract,
        effortWeight: data.effortWeight,
        status: 'pending',
      })
      .returning();

    // Create subtasks
    if (data.subtasks.length > 0) {
      await db.insert(subtasks).values(
        data.subtasks.map((st, index) => ({
          taskId: task.id,
          title: st.title,
          effortWeight: st.effortWeight,
          orderIndex: index,
        }))
      );
    }

    // Revalidate paths
    revalidatePath('/tasks');

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
