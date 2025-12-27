import * as Sentry from '@sentry/tanstackstart-react';

const sentryDsn =
  import.meta.env?.VITE_SENTRY_DSN ?? process.env.VITE_SENTRY_DSN;

if (sentryDsn) {
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/
  Sentry.init({
    dsn: sentryDsn,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  });
}
