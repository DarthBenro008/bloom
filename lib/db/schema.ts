import { pgTable, text, timestamp, integer, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const effortWeightEnum = pgEnum('effort_weight', ['light', 'medium', 'heavy']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'abandoned']);
export const plausibilityLevelEnum = pgEnum('plausibility_level', ['high', 'medium', 'low']);

// Plant types mapped to effort levels
export const PLANT_TYPES = {
  light: ['daisy', 'tulip', 'poppy'] as const,
  medium: ['rose', 'sunflower', 'lavender'] as const,
  heavy: ['oak', 'cherry_blossom', 'maple'] as const,
} as const;

export type PlantType = typeof PLANT_TYPES[keyof typeof PLANT_TYPES][number];
export type EffortWeight = 'light' | 'medium' | 'heavy';

// Users table (synced with NeonAuth's neon_auth.users)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Matches NeonAuth user ID
  gardenHealth: integer('garden_health').default(100).notNull(), // 0-100
  totalTasksCompleted: integer('total_tasks_completed').default(0).notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),                    // Original vague input
  completionContract: text('completion_contract'),   // "What will exist?"
  status: taskStatusEnum('status').default('pending').notNull(),
  effortWeight: effortWeightEnum('effort_weight').default('medium').notNull(),
  plausibilityScore: integer('plausibility_score'), // 0-100, null until completed
  plausibilityLevel: plausibilityLevelEnum('plausibility_level'),
  reflectionResponse: text('reflection_response'),   // User's reflection
  reflectionQuestion: text('reflection_question'),   // AI-generated question
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// Subtasks table
export const subtasks = pgTable('subtasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  effortWeight: effortWeightEnum('effort_weight').default('light').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Plants table (garden state)
export const plants = pgTable('plants', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  taskId: uuid('task_id').references(() => tasks.id),
  plantType: text('plant_type').notNull(),           // 'daisy', 'oak', etc.
  growthStage: integer('growth_stage').default(0).notNull(), // 0-5
  health: integer('health').default(100).notNull(),  // 0-100
  positionX: integer('position_x').notNull(),        // Grid position
  positionY: integer('position_y').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  plants: many(plants),
  moods: many(moods),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  subtasks: many(subtasks),
  plant: one(plants, {
    fields: [tasks.id],
    references: [plants.taskId],
  }),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
}));

export const plantsRelations = relations(plants, ({ one }) => ({
  user: one(users, {
    fields: [plants.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [plants.taskId],
    references: [tasks.id],
  }),
}));

// Moods table (daily mood check-ins)
export const moods = pgTable('moods', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  mood: text('mood').notNull(),           // emoji or mood type
  note: text('note'),                      // optional elaboration
  aiResponse: text('ai_response'),         // AI's encouraging response
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const moodsRelations = relations(moods, ({ one }) => ({
  user: one(users, {
    fields: [moods.userId],
    references: [users.id],
  }),
}));

// Type exports for use in the app
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Subtask = typeof subtasks.$inferSelect;
export type NewSubtask = typeof subtasks.$inferInsert;
export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;
export type Mood = typeof moods.$inferSelect;
export type NewMood = typeof moods.$inferInsert;
