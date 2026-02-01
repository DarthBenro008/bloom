'use server';

import { db } from '@/lib/db';
import { tasks, subtasks, plants, users, PLANT_TYPES } from '@/lib/db/schema';
import type { EffortWeight, Task, Subtask, Plant } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { generateReflectionQuestion, evaluatePlausibility } from './ai';

/**
 * Get or create user profile
 */
export async function getOrCreateUser() {
  const session = await auth.getSession();
  if (!session?.data?.user?.id) {
    throw new Error('Not authenticated');
  }

  const userId = session.data.user.id;

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const [newUser] = await db.insert(users).values({
    id: userId,
  }).returning();

  return newUser;
}

/**
 * Create a new task with subtasks
 */
export async function createTask(data: {
  title: string;
  completionContract: string;
  effortWeight: EffortWeight;
  subtasks: Array<{ title: string; effortWeight: EffortWeight }>;
}) {
  const user = await getOrCreateUser();

  // Create the task
  const [task] = await db.insert(tasks).values({
    userId: user.id,
    title: data.title,
    completionContract: data.completionContract,
    effortWeight: data.effortWeight,
    status: 'pending',
  }).returning();

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

  revalidatePath('/tasks');
  return task;
}

/**
 * Get all tasks for the current user
 */
export async function getUserTasks() {
  const user = await getOrCreateUser();

  const userTasks = await db.query.tasks.findMany({
    where: eq(tasks.userId, user.id),
    with: {
      subtasks: {
        orderBy: (subtasks, { asc }) => [asc(subtasks.orderIndex)],
      },
    },
    orderBy: [desc(tasks.createdAt)],
  });

  return userTasks;
}

/**
 * Get a single task by ID
 */
export async function getTask(taskId: string) {
  const user = await getOrCreateUser();

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), eq(tasks.userId, user.id)),
    with: {
      subtasks: {
        orderBy: (subtasks, { asc }) => [asc(subtasks.orderIndex)],
      },
    },
  });

  return task;
}

/**
 * Start working on a task
 */
export async function startTask(taskId: string) {
  const user = await getOrCreateUser();

  await db.update(tasks)
    .set({ status: 'in_progress' })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

  revalidatePath('/tasks');
  revalidatePath(`/tasks/${taskId}`);
}

/**
 * Toggle subtask completion
 */
export async function toggleSubtask(subtaskId: string) {
  const user = await getOrCreateUser();

  // Get subtask with task info
  const subtask = await db.query.subtasks.findFirst({
    where: eq(subtasks.id, subtaskId),
    with: { task: true },
  });

  if (!subtask || subtask.task.userId !== user.id) {
    throw new Error('Subtask not found');
  }

  await db.update(subtasks)
    .set({ isCompleted: !subtask.isCompleted })
    .where(eq(subtasks.id, subtaskId));

  revalidatePath('/tasks');
  revalidatePath(`/tasks/${subtask.taskId}`);
}

/**
 * Initiate task completion - generates reflection question
 */
export async function initiateCompletion(taskId: string) {
  const task = await getTask(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  const subtaskTitles = task.subtasks.map(st => st.title);
  
  const question = await generateReflectionQuestion(
    task.title,
    subtaskTitles,
    task.completionContract || 'Something meaningful'
  );

  // Store the question
  await db.update(tasks)
    .set({ reflectionQuestion: question })
    .where(eq(tasks.id, taskId));

  revalidatePath(`/tasks/${taskId}/complete`);
  return question;
}

/**
 * Complete a task with reflection
 */
export async function completeTask(taskId: string, reflectionResponse: string) {
  const task = await getTask(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  const user = await getOrCreateUser();
  const subtaskTitles = task.subtasks.map(st => st.title);

  // Evaluate plausibility
  const plausibility = await evaluatePlausibility(
    task.title,
    subtaskTitles,
    task.effortWeight,
    task.completionContract || '',
    reflectionResponse
  );

  // Update task
  await db.update(tasks)
    .set({
      status: 'completed',
      reflectionResponse,
      plausibilityScore: plausibility.score,
      plausibilityLevel: plausibility.level,
      completedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  // Update user stats
  await db.update(users)
    .set({
      totalTasksCompleted: user.totalTasksCompleted + 1,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  // Create or update plant based on plausibility
  await createOrUpdatePlant(user.id, taskId, task.effortWeight, plausibility.level);

  // Update garden health based on plausibility
  await updateGardenHealth(user.id, plausibility.level);

  revalidatePath('/tasks');
  revalidatePath(`/tasks/${taskId}`);
  revalidatePath('/');

  return { plausibility };
}

/**
 * Create or update a plant for a completed task
 */
async function createOrUpdatePlant(
  userId: string,
  taskId: string,
  effortWeight: EffortWeight,
  plausibilityLevel: 'high' | 'medium' | 'low'
) {
  // Select plant type based on effort weight
  const plantTypes = PLANT_TYPES[effortWeight];
  const plantType = plantTypes[Math.floor(Math.random() * plantTypes.length)];

  // Calculate growth stage based on plausibility
  let growthStage: number;
  let health: number;

  switch (plausibilityLevel) {
    case 'high':
      growthStage = 5; // Full growth
      health = 100;
      break;
    case 'medium':
      growthStage = 3; // Partial growth
      health = 70;
      break;
    case 'low':
      growthStage = 1; // Minimal growth
      health = 40;
      break;
  }

  // Find next available position
  const existingPlants = await db.query.plants.findMany({
    where: eq(plants.userId, userId),
  });

  const position = findNextPosition(existingPlants);

  await db.insert(plants).values({
    userId,
    taskId,
    plantType,
    growthStage,
    health,
    positionX: position.x,
    positionY: position.y,
  });
}

/**
 * Find next available grid position for a plant
 */
function findNextPosition(existingPlants: Plant[]): { x: number; y: number } {
  const gridSize = 8; // 8x8 grid
  const occupied = new Set(existingPlants.map(p => `${p.positionX},${p.positionY}`));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!occupied.has(`${x},${y}`)) {
        return { x, y };
      }
    }
  }

  // If grid is full, stack at random position
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };
}

/**
 * Update garden health based on task completion plausibility
 */
async function updateGardenHealth(
  userId: string,
  plausibilityLevel: 'high' | 'medium' | 'low'
) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return;

  let healthChange: number;
  switch (plausibilityLevel) {
    case 'high':
      healthChange = 5; // Boost health
      break;
    case 'medium':
      healthChange = 0; // No change
      break;
    case 'low':
      healthChange = -10; // Decay
      break;
  }

  const newHealth = Math.max(0, Math.min(100, user.gardenHealth + healthChange));

  await db.update(users)
    .set({
      gardenHealth: newHealth,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  // If health dropped, decay some plants
  if (healthChange < 0) {
    await decayPlants(userId);
  }
}

/**
 * Decay random plants when garden health drops
 */
async function decayPlants(userId: string) {
  const userPlants = await db.query.plants.findMany({
    where: eq(plants.userId, userId),
  });

  // Decay 1-2 random plants
  const plantsToDecay = userPlants
    .filter(p => p.health > 20)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  for (const plant of plantsToDecay) {
    await db.update(plants)
      .set({
        health: Math.max(0, plant.health - 15),
        updatedAt: new Date(),
      })
      .where(eq(plants.id, plant.id));
  }
}

/**
 * Get user's garden (all plants)
 */
export async function getUserGarden() {
  const user = await getOrCreateUser();

  const userPlants = await db.query.plants.findMany({
    where: eq(plants.userId, user.id),
    with: {
      task: true,
    },
  });

  return {
    plants: userPlants,
    health: user.gardenHealth,
  };
}

/**
 * Abandon a task
 */
export async function abandonTask(taskId: string) {
  const user = await getOrCreateUser();

  await db.update(tasks)
    .set({ status: 'abandoned' })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

  // Decay garden for abandoned task
  await updateGardenHealth(user.id, 'low');

  revalidatePath('/tasks');
  revalidatePath(`/tasks/${taskId}`);
}

/**
 * Complete user onboarding
 */
export async function completeOnboarding() {
  const user = await getOrCreateUser();

  await db.update(users)
    .set({
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath('/');
}
