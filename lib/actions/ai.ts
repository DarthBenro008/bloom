'use server';

import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';

// Schema for task breakdown
const SubtaskSchema = z.object({
  title: z.string().describe('The actionable subtask title'),
  effortWeight: z.enum(['light', 'medium', 'heavy']).describe('Effort level required'),
});

const BreakdownSchema = z.object({
  subtasks: z.array(SubtaskSchema).min(2).max(6),
  suggestedOverallWeight: z.enum(['light', 'medium', 'heavy']),
});

export type TaskBreakdown = z.infer<typeof BreakdownSchema>;
export type SubtaskData = z.infer<typeof SubtaskSchema>;

/**
 * Break down a vague task into concrete, actionable subtasks
 */
export async function breakdownTask(vagueTask: string): Promise<TaskBreakdown> {
  const result = await generateObject({
    model: aiModel,
    schema: BreakdownSchema,
    system: AI_PROMPTS.TASK_BREAKDOWN,
    prompt: `Break down this task into concrete, actionable steps: "${vagueTask}"`,
  });

  return result.object;
}

/**
 * Generate a reflection question for task completion
 */
export async function generateReflectionQuestion(
  taskTitle: string,
  subtasks: string[],
  completionContract: string
): Promise<string> {
  const result = await generateText({
    model: aiModel,
    system: AI_PROMPTS.REFLECTION_QUESTION,
    prompt: `Task: ${taskTitle}
Subtasks completed: ${subtasks.join(', ')}
What the user committed to create: ${completionContract}

Generate a single reflection question for this completed task.`,
  });

  return result.text.trim();
}

// Schema for plausibility evaluation
const PlausibilitySchema = z.object({
  score: z.number().min(0).max(100).describe('Plausibility score from 0-100'),
  level: z.enum(['high', 'medium', 'low']).describe('Plausibility level'),
  reasoning: z.string().describe('Brief internal reasoning (not shown to user)'),
});

export type PlausibilityResult = z.infer<typeof PlausibilitySchema>;

/**
 * Evaluate the plausibility of a task completion
 * This result is hidden from the user and affects garden growth
 */
export async function evaluatePlausibility(
  taskTitle: string,
  subtasks: string[],
  effortWeight: string,
  completionContract: string,
  reflectionResponse: string
): Promise<PlausibilityResult> {
  const result = await generateObject({
    model: aiModel,
    schema: PlausibilitySchema,
    system: AI_PROMPTS.PLAUSIBILITY_EVALUATION,
    prompt: `Evaluate the plausibility of this task completion:

Task: ${taskTitle}
Subtasks: ${subtasks.join(', ')}
Effort Level: ${effortWeight}
Completion Contract (what user said would exist): ${completionContract}
User's Reflection Response: ${reflectionResponse}

Assess whether real work likely happened.`,
  });

  return result.object;
}

/**
 * Generate an onboarding welcome message
 */
export async function generateWelcomeMessage(): Promise<string> {
  const result = await generateText({
    model: aiModel,
    system: AI_PROMPTS.ONBOARDING_WELCOME,
    prompt: 'Welcome a new user to Bloom.',
  });

  return result.text.trim();
}
