import * as Sentry from '@sentry/tanstackstart-react';

if (process.env.VITE_SENTRY_DSN) {
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    release: process.env.VITE_SENTRY_RELEASE,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  });
}
