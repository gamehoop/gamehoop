import { Shell } from '@/components/app/shell/shell';
import { useColorScheme } from '@/components/ui/hooks/use-color-scheme';
import { Notifications } from '@/components/ui/notifications';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_layout/_authed')({
  beforeLoad: ({ context: { user }, location }) => {
    if (!user) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } });
    }

    return { user };
  },
  loader: ({ context: { user } }) => {
    return { user };
  },
  component: Authed,
});

function Authed() {
  const { user } = Route.useLoaderData();
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const preferredScheme = user.settings?.darkMode ? 'dark' : 'light';
    if (colorScheme !== preferredScheme) {
      setColorScheme(preferredScheme);
    }
  }, [user, colorScheme, setColorScheme]);

  return (
    <>
      <Shell user={user}>
        <Outlet />
      </Shell>
      <Notifications position="bottom-right" />
    </>
  );
}
