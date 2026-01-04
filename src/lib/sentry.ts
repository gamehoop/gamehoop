import { env } from '@/env/client';
import * as Sentry from '@sentry/tanstackstart-react';

export function initSentry() {
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    integrations: [],
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
  });
}
