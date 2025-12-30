import { env } from '@/env/client';
import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { correlationHeader } from '@/middlewares/request-id-middleware';
import { createMiddleware } from '@tanstack/react-start';

// A global middleware to log details of every request/response.
export const loggerMiddleware = createMiddleware().server(
  async ({ request: { headers, method, url }, next }) => {
    const session = await auth.api.getSession({ headers });

    const requestInfo = {
      requestId: headers.get(correlationHeader),
      userId: session?.user?.id,
      method,
      url,
      serverFn: extractServerFnName(url),
    };

    const startTime = Date.now();
    try {
      const response = await next();
      const duration = Date.now() - startTime;

      const {
        response: { status },
      } = response;

      logger.info(
        env.VITE_ENVIRONMENT === 'development'
          ? {}
          : {
              ...requestInfo,
              status,
              duration,
            },
        `${method} ${url} ${status} ${duration}ms`,
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(
        env.VITE_ENVIRONMENT === 'development'
          ? {}
          : {
              ...requestInfo,
              error,
              duration,
            },
        `${method} ${url} ERROR ${duration}ms`,
      );
      throw error;
    }
  },
);

function extractServerFnName(url: string): string | undefined {
  const start = url.lastIndexOf('/');
  const end = url.indexOf('-', start);
  if (start === -1 || end === -1) {
    return;
  }

  return url.substring(start + 1, end);
}
