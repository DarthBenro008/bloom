import { registerOTel } from '@vercel/otel';
import { OpikExporter } from 'opik-vercel';

export function register() {
  registerOTel({
    serviceName: 'bloom-ai',
    traceExporter: new OpikExporter({
      tags: ['bloom', 'productivity', 'ai-tasks'],
      metadata: {
        project: 'bloom',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      },
    }),
  });
}
