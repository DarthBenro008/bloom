import { db } from '@/lib/db';
import { plants, users, PLANT_TYPES } from '@/lib/db/schema';
import type { EffortWeight, Plant } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Internal database helper functions
 * Used by API routes to perform garden-related operations
 */

/**
 * Create or update a plant for a completed task
 */
export async function createOrUpdatePlant(
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
export function findNextPosition(existingPlants: Plant[]): { x: number; y: number } {
  const gridSize = 8; // 8x8 grid
  const occupied = new Set(existingPlants.map((p) => `${p.positionX},${p.positionY}`));

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
export async function updateGardenHealth(
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
export async function decayPlants(userId: string) {
  const userPlants = await db.query.plants.findMany({
    where: eq(plants.userId, userId),
  });

  // Decay 1-2 random plants
  const plantsToDecay = userPlants
    .filter((p) => p.health > 20)
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
