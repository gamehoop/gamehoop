import pino from 'pino';

export const logger = createLogger();

export function createLogger() {
  const isDevelopment =
    process.env.VITE_ENVIRONMENT === 'development' || process.env.VITEST;

  // Pretty print logs during development. JSON for production.
  const transport = isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
        },
      }
    : undefined;

  // Show log level as words rather than numbers
  const formatters = {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
  };

  return pino({
    level: isDevelopment ? 'debug' : 'info',
    transport,
    // Also log in the browser
    browser: {
      asObject: typeof window !== 'undefined',
      formatters,
    },
    formatters,
    // Format the timestamp
    timestamp: pino.stdTimeFunctions.isoTime,
    // Redact sensitive information
    redact: [],
  });
}

export function logError(error: unknown) {
  if (error instanceof Error) {
    logger.error({ stack: error.stack }, error.message);
  } else {
    logger.error({ error }, 'Unknown error');
  }
}
