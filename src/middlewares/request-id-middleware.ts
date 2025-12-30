import { createMiddleware } from '@tanstack/react-start';

export const correlationHeader = 'X-Request-ID';

// Adds a correlation ID to each request for tracing purposes.
export const requestIdMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const requestId =
      request.headers.get(correlationHeader) || crypto.randomUUID();
    request.headers.set(correlationHeader, requestId);
    return next();
  },
);
