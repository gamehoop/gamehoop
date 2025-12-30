import { createEnv } from '@t3-oss/env-core';
import z from 'zod';

export const env = createEnv({
  server: {
    // App
    SOURCE_COMMIT: z.string().optional(),

    // Authentication
    BETTER_AUTH_URL: z.string().default('http://localhost:3000'),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true'),

    // Database
    DATABASE_URL: z.string(),
    DATABASE_LOGGER: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),

    // Emails
    SMTP_SERVER: z.string(),
    SMTP_PORT: z.coerce.number().min(1).max(65535),
    SMTP_USERNAME: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_SENDER: z.email(),

    // Object storage
    S3_ENDPOINT_URL: z.url().optional(),
    S3_REGION: z.string().optional(),
    S3_BUCKET_NAME: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
