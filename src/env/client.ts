import { createEnv } from '@t3-oss/env-core';
import z from 'zod';

export const env = createEnv({
  client: {
    // App
    VITE_SOURCE_COMMIT: z.string().optional(),
    VITE_APP_NAME: z.string().default('Gamehoop'),
    VITE_BASE_URL: z.string().default('http://localhost:3000'),
    VITE_ENVIRONMENT: z
      .enum(['development', 'production'])
      .default('production'),

    // Error tracking
    VITE_SENTRY_DSN: z.url().optional(),
    VITE_SENTRY_RELEASE: z.string().optional(),
  },
  clientPrefix: 'VITE_',
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
