import { AppShell } from '@/components/ui/app-shell';
import { useSessionContext } from '@/hooks/use-session-context';
import { updateUser } from '@/libs/auth/client';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from '@tanstack/react-router';
import { PropsWithChildren } from 'react';
import { ShellNavbarCollapsedContent } from './shell-collapsed-navbar-content';
import { ShellNavbarContent } from './shell-navbar-content';

export function Shell({ children }: PropsWithChildren) {
  const { user } = useSessionContext();
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(!user.settings?.navbarCollapsed);

  const onCollapseNavbar = async () => {
    toggle();

    await updateUser({
      settings: {
        ...user.settings,
        navbarCollapsed: !user.settings?.navbarCollapsed,
      },
    });
    await router.invalidate();
  };

  return (
    <AppShell
      navbar={{
        width: opened ? 250 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: true },
      }}
    >
      <AppShell.Navbar>
        {opened ? (
          <ShellNavbarContent onCollapseNavbar={onCollapseNavbar} />
        ) : (
          <ShellNavbarCollapsedContent onCollapseNavbar={onCollapseNavbar} />
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="p-4 max-w-400 mx-auto">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
