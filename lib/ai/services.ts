/**
 * Server-side AI services
 * These functions can be called directly from API routes without HTTP overhead
 */

import { generateText, generateObject } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { z } from 'zod';

/**
 * Generate a reflection question for task completion
 * Server-side direct call (no HTTP)
 */
export async function generateReflectionQuestionDirect(
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

/**
 * Evaluate the plausibility of a task completion
 * Server-side direct call (no HTTP)
 */
const PlausibilitySchema = z.object({
  score: z.number().min(0).max(100).describe('Plausibility score from 0-100'),
  level: z.enum(['high', 'medium', 'low']).describe('Plausibility level'),
  reasoning: z.string().describe('Brief internal reasoning (not shown to user)'),
});

export type PlausibilityResult = z.infer<typeof PlausibilitySchema>;

export async function evaluatePlausibilityDirect(
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
