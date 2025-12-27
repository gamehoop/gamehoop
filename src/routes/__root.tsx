import { ColorSchemeScript, uiHtmlProps, UIProvider } from '@/components/ui';
import { ModalsProvider } from '@/components/ui/modals';
import { Notifications } from '@/components/ui/notifications';
import { NavigationProgress } from '@/components/ui/nprogress';
import { theme, themeColor } from '@/styles/theme';
import { seo } from '@/utils/seo';
import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { PropsWithChildren } from 'react';
import Header from '../components/Header';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import appCss from '../styles.css?url';

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
        title: 'gamehoop',
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
  shellComponent: RootComponent,
});

function RootComponent() {
  return (
    <RootProviders>
      <Outlet />
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
          <Notifications position="top-right" />
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
        <Header />
        {children}

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
