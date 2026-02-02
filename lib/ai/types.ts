import { z } from 'zod';

/**
 * Shared AI types and Zod schemas
 * Used by both API routes and client code
 */

// ============================================================================
// Task Breakdown Schemas
// ============================================================================

export const SubtaskSchema = z.object({
  title: z.string().describe('The actionable subtask title'),
  effortWeight: z.enum(['light', 'medium', 'heavy']).describe('Effort level required'),
});

export const BreakdownSchema = z.object({
  subtasks: z.array(SubtaskSchema).min(2).max(6),
  suggestedOverallWeight: z.enum(['light', 'medium', 'heavy']),
  suggestedExpectedOutput: z.string().describe('What will concretely exist after this task is done'),
});

export type SubtaskData = z.infer<typeof SubtaskSchema>;
export type TaskBreakdown = z.infer<typeof BreakdownSchema>;

// ============================================================================
// Plausibility Evaluation Schema
// ============================================================================

export const PlausibilitySchema = z.object({
  score: z.number().min(0).max(100).describe('Plausibility score from 0-100'),
  level: z.enum(['high', 'medium', 'low']).describe('Plausibility level'),
  reasoning: z.string().describe('Brief internal reasoning (not shown to user)'),
});

export type PlausibilityResult = z.infer<typeof PlausibilitySchema>;

// ============================================================================
// API Request/Response Types
// ============================================================================

// Breakdown Task
export const BreakdownRequestSchema = z.object({
  vagueTask: z.string().min(1).max(500),
});

export type BreakdownRequest = z.infer<typeof BreakdownRequestSchema>;

// Modify Breakdown
export const ModifyBreakdownRequestSchema = z.object({
  originalTask: z.string().min(1).max(500),
  currentBreakdown: BreakdownSchema,
  userMessage: z.string().min(1).max(500),
});

export type ModifyBreakdownRequest = z.infer<typeof ModifyBreakdownRequestSchema>;

// Reflection Question
export const ReflectionQuestionRequestSchema = z.object({
  taskTitle: z.string().min(1),
  subtasks: z.array(z.string()),
  completionContract: z.string(),
});

export type ReflectionQuestionRequest = z.infer<typeof ReflectionQuestionRequestSchema>;

export const ReflectionQuestionResponseSchema = z.object({
  question: z.string(),
});

export type ReflectionQuestionResponse = z.infer<typeof ReflectionQuestionResponseSchema>;

// Evaluate Plausibility
export const EvaluatePlausibilityRequestSchema = z.object({
  taskTitle: z.string().min(1),
  subtasks: z.array(z.string()),
  effortWeight: z.string(),
  completionContract: z.string(),
  reflectionResponse: z.string().min(1),
});

export type EvaluatePlausibilityRequest = z.infer<typeof EvaluatePlausibilityRequestSchema>;

// Welcome Message
export const WelcomeMessageResponseSchema = z.object({
  message: z.string(),
});

export type WelcomeMessageResponse = z.infer<typeof WelcomeMessageResponseSchema>;
