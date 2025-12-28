import { nprogress } from '@/components/ui/nprogress';
import * as Sentry from '@sentry/tanstackstart-react';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import * as TanstackQuery from './queries';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
    },
    // Restore the scroll position of a page when the user navigates back to it.
    scrollRestoration: true,
    // Preload routes on intent (e.g. hover, touch.)
    defaultPreload: 'intent',
    // Preload after 50 milliseconds.
    defaultPreloadDelay: 50,
    // Use the not found component defined in the root component.
    notFoundMode: 'root',
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  if (!router.isServer) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [],
      tracesSampleRate: 1.0,
      sendDefaultPii: true,
    });
  }

  // Update the navigation progress bar
  router.subscribe(
    'onBeforeLoad',
    (e) => e.fromLocation && e.pathChanged && nprogress.start(),
  );
  router.subscribe('onLoad', nprogress.complete);

  return router;
};
