/**
 * Client-side API wrapper for AI endpoints
 * These functions can be called from both client and server components
 */

import type {
  TaskBreakdown,
  PlausibilityResult,
} from '@/lib/ai/types';

/**
 * Break down a vague task into concrete, actionable subtasks
 */
export async function breakdownTask(vagueTask: string): Promise<TaskBreakdown> {
  const response = await fetch('/api/ai/breakdown', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vagueTask }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to break down task');
  }

  return response.json();
}

/**
 * Modify an existing breakdown based on user feedback
 */
export async function modifyBreakdown(
  originalTask: string,
  currentBreakdown: TaskBreakdown,
  userMessage: string
): Promise<TaskBreakdown> {
  const response = await fetch('/api/ai/modify-breakdown', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ originalTask, currentBreakdown, userMessage }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to modify breakdown');
  }

  return response.json();
}

/**
 * Generate a welcome message for onboarding
 */
export async function generateWelcomeMessage(): Promise<string> {
  const response = await fetch('/api/ai/welcome', {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to generate welcome message');
  }

  const data = await response.json();
  return data.message;
}

/**
 * Generate a reflection question for task completion
 */
export async function generateReflectionQuestion(
  taskTitle: string,
  subtasks: string[],
  completionContract: string
): Promise<string> {
  const response = await fetch('/api/ai/reflection-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskTitle, subtasks, completionContract }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to generate reflection question');
  }

  const data = await response.json();
  return data.question;
}

/**
 * Evaluate the plausibility of a task completion
 */
export async function evaluatePlausibility(
  taskTitle: string,
  subtasks: string[],
  effortWeight: string,
  completionContract: string,
  reflectionResponse: string
): Promise<PlausibilityResult> {
  const response = await fetch('/api/ai/evaluate-plausibility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      taskTitle,
      subtasks,
      effortWeight,
      completionContract,
      reflectionResponse,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to evaluate plausibility');
  }

  return response.json();
}
