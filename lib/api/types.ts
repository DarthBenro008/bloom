import { z } from 'zod';
import type { EffortWeight, Task, Subtask, Plant, User } from '@/lib/db/schema';

/**
 * Task API Request/Response Types
 */

// Create Task
export const CreateTaskRequestSchema = z.object({
  title: z.string().min(1).max(500),
  completionContract: z.string().min(1),
  effortWeight: z.enum(['light', 'medium', 'heavy']),
  subtasks: z.array(
    z.object({
      title: z.string().min(1),
      effortWeight: z.enum(['light', 'medium', 'heavy']),
    })
  ).min(1).max(10),
});

export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

// Complete Task
export const CompleteTaskRequestSchema = z.object({
  reflectionResponse: z.string().min(1),
});

export type CompleteTaskRequest = z.infer<typeof CompleteTaskRequestSchema>;

// Task with Subtasks (Response)
export type TaskWithSubtasks = Task & {
  subtasks: Subtask[];
};

// Garden Response
export type GardenResponse = {
  plants: (Plant & { task: Task })[];
  health: number;
};

// Complete Task Response
export type CompleteTaskResponse = {
  plausibility: {
    score: number;
    level: 'high' | 'medium' | 'low';
    reasoning: string;
  };
};

// Initiate Completion Response
export type InitiateCompletionResponse = {
  question: string;
};

// User Response
export type UserResponse = User;
