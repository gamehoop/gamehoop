import { nprogress } from '@/components/ui/nprogress';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { SomethingWentWrong } from './components/app/sww';
import { logError } from './lib/logger';
import { initSentry } from './lib/sentry';
import * as TanstackQuery from './queries';
import { routeTree } from './routeTree.gen';

export const getRouter = () => {
  const queryClientContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: {
      ...queryClientContext,
    },
    defaultErrorComponent: (props) => <SomethingWentWrong {...props} />,
    defaultOnCatch: (error) => logError(error),
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
    queryClient: queryClientContext.queryClient,
  });

  if (!router.isServer) {
    initSentry();
  }

  // Update the navigation progress bar
  router.subscribe(
    'onBeforeLoad',
    (e) => e.fromLocation && e.pathChanged && nprogress.start(),
  );
  router.subscribe('onLoad', nprogress.complete);

  return router;
};
