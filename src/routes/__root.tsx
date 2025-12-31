import { NotFound } from '@/components/app/not-found';
import { SomethingWentWrong } from '@/components/app/sww';
import { ColorSchemeScript, uiHtmlProps, UIProvider } from '@/components/ui';
import { ModalsProvider } from '@/components/ui/modals';
import { NavigationProgress } from '@/components/ui/nprogress';
import { env } from '@/env/client';
import { getUser } from '@/functions/auth/get-user';
import { getOrganizations } from '@/functions/user/get-organizations';
import { theme, themeColor } from '@/styles/theme';
import { seo } from '@/utils/seo';
import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  ErrorComponentProps,
  HeadContent,
  NotFoundRouteProps,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { PropsWithChildren } from 'react';
import appCss from '../styles/app.css?url';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: env.VITE_APP_NAME,
        description: 'The easy to use tools to build and scale your games.',
      }),
      {
        name: 'theme-color',
        content: themeColor,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      { rel: 'manifest', href: '/manifest.json', color: themeColor },
    ],
  }),
  beforeLoad: async () => {
    try {
      const [user, organizations] = await Promise.all([
        getUser(),
        getOrganizations(),
      ]);
      return { user, organizations };
    } catch {
      // The current user is unauthenticated
      return {};
    }
  },
  shellComponent: RootComponent,
  notFoundComponent: RootNotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootComponent() {
  const { user } = Route.useRouteContext();
  const defaultColorScheme = user?.settings?.darkMode ? 'dark' : 'light';

  return (
    <RootProviders defaultColorScheme={defaultColorScheme}>
      <Outlet />
    </RootProviders>
  );
}

function RootNotFoundComponent(props: NotFoundRouteProps) {
  return <NotFound {...props} />;
}

function RootErrorComponent(props: ErrorComponentProps) {
  const { user } = Route.useRouteContext();
  const defaultColorScheme = user?.settings?.darkMode ? 'dark' : 'light';

  return (
    <RootProviders defaultColorScheme={defaultColorScheme}>
      <SomethingWentWrong {...props} />
    </RootProviders>
  );
}

function RootProviders({
  defaultColorScheme = 'light',
  children,
}: PropsWithChildren<{
  defaultColorScheme?: 'light' | 'dark';
}>) {
  return (
    <RootDocument colorScheme={defaultColorScheme}>
      <UIProvider theme={theme} defaultColorScheme={defaultColorScheme}>
        <ModalsProvider>
          <NavigationProgress />
          {children}
        </ModalsProvider>
      </UIProvider>
    </RootDocument>
  );
}

function RootDocument({
  children,
  colorScheme,
}: PropsWithChildren<{ colorScheme?: 'light' | 'dark' }>) {
  return (
    <html lang="en" {...uiHtmlProps}>
      <head>
        <HeadContent />
        <ColorSchemeScript defaultColorScheme={colorScheme} />
      </head>
      <body>
        {children}

        <Scripts />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
            hideUntilHover: true,
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
      </body>
    </html>
  );
}
