import { requestIdMiddleware } from '@/middlewares/request-id-middleware';
import { createStart } from '@tanstack/react-start';
import { loggerMiddleware } from './middlewares/logger-middleware';

export const startInstance = createStart(() => ({
  // Global middleware that runs before EVERY request.
  // https://tanstack.com/start/latest/docs/framework/react/guide/middleware#global-middleware
  requestMiddleware: [requestIdMiddleware, loggerMiddleware],
}));
