import { OpikExporter } from 'opik-vercel';

export type TelemetryContext = {
  taskId?: string;
  userId?: string;
  effortWeight?: string;
  threadId?: string;
};

/**
 * Generate telemetry settings for AI SDK calls
 * Includes trace name and metadata for Opik observability
 */
export function getAITelemetry(traceName: string, context?: TelemetryContext) {
  return OpikExporter.getSettings({
    name: `bloom:${traceName}`,
    metadata: {
      ...(context?.taskId && { taskId: context.taskId }),
      ...(context?.userId && { userId: context.userId }),
      ...(context?.effortWeight && { effortWeight: context.effortWeight }),
      ...(context?.threadId && { threadId: context.threadId }),
    },
  });
}
