/**
 * Server-side AI services
 * These functions can be called directly from API routes without HTTP overhead
 */

import { generateText, Output, NoObjectGeneratedError } from 'ai';
import { aiModel } from '@/lib/ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';
import { z } from 'zod';
import { getAITelemetry, type TelemetryContext } from './telemetry';

/**
 * Generate a reflection question for task completion
 * Server-side direct call (no HTTP)
 */
export async function generateReflectionQuestionDirect(
  taskTitle: string,
  subtasks: string[],
  completionContract: string,
  context?: TelemetryContext
): Promise<string> {
  const result = await generateText({
    model: aiModel,
    system: AI_PROMPTS.REFLECTION_QUESTION,
    prompt: `Task: ${taskTitle}
Subtasks completed: ${subtasks.join(', ')}
What the user committed to create: ${completionContract}

Generate a single reflection question for this completed task.`,
    experimental_telemetry: getAITelemetry('reflection-question', context),
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
  reflectionResponse: string,
  context?: TelemetryContext
): Promise<PlausibilityResult> {
  try {
    const result = await generateText({
      model: aiModel,
      output: Output.object({
        name: 'PlausibilityEvaluation',
        description: 'An evaluation of whether a task completion is plausible based on the user\'s reflection',
        schema: PlausibilitySchema,
      }),
      system: AI_PROMPTS.PLAUSIBILITY_EVALUATION,
      prompt: `Evaluate the plausibility of this task completion:

Task: ${taskTitle}
Subtasks: ${subtasks.join(', ')}
Effort Level: ${effortWeight}
Completion Contract (what user said would exist): ${completionContract}
User's Reflection Response: ${reflectionResponse}

Assess whether real work likely happened.`,
      experimental_telemetry: getAITelemetry('plausibility-evaluation', {
        ...context,
        effortWeight,
      }),
    });

    return result.output;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      console.error('Failed to generate plausibility evaluation:', {
        cause: error.cause,
        text: error.text,
        response: error.response,
        usage: error.usage,
      });
    }
    throw error;
  }
}
