import * as Sentry from '@sentry/tanstackstart-react';

if (process.env.VITE_SENTRY_DSN) {
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    release: process.env.VITE_SENTRY_RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 0.1,
  });
}
