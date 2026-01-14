import { env } from '@/env/client';
import * as Sentry from '@sentry/tanstackstart-react';

export function initSentry() {
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    release: env.VITE_SENTRY_RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
}
