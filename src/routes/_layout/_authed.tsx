import { Shell } from '@/components/app/shell/shell';
import { useColorScheme } from '@/components/ui/hooks/use-color-scheme';
import { Notifications } from '@/components/ui/notifications';
import { SessionContext } from '@/contexts/session-context';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_layout/_authed')({
  beforeLoad: ({ context: { user, organizations }, location }) => {
    if (!user) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } });
    }

    return { user, organizations };
  },
  loader: ({ context: { user, organizations } }) => {
    const activeOrganization =
      organizations.find(
        (org) => org.id === user.settings?.activeOrganizationId,
      ) ?? organizations[0];

    if (!activeOrganization) {
      throw new Error('No organization found for user');
    }

    return { user, organizations, activeOrganization };
  },
  component: Authed,
});

function Authed() {
  const { user, organizations, activeOrganization } = Route.useLoaderData();
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const preferredScheme = user.settings?.darkMode ? 'dark' : 'light';
    if (colorScheme !== preferredScheme) {
      setColorScheme(preferredScheme);
    }
  }, [user, colorScheme, setColorScheme]);

  return (
    <SessionContext.Provider
      value={{ user, organizations, activeOrganization }}
    >
      <Shell>
        <Outlet />
      </Shell>
      <Notifications position="bottom-right" />
    </SessionContext.Provider>
  );
}
