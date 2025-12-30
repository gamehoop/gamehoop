import { AppShell } from '@/components/ui/app-shell';
import { useAccountNotifier } from '@/hooks/use-account-notifier';
import { SessionUser } from '@/lib/auth';
import { updateUser } from '@/lib/auth/client';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from '@tanstack/react-router';
import { PropsWithChildren } from 'react';
import { ShellNavbarCollapsedContent } from './shell-collapsed-navbar-content';
import { ShellNavbarContent } from './shell-navbar-content';

export interface ShellProps extends PropsWithChildren {
  user: SessionUser;
}

export function Shell({ user, children }: ShellProps) {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(!user.settings?.navbarCollapsed);

  useAccountNotifier({ user });

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
          <ShellNavbarContent user={user} onCollapseNavbar={onCollapseNavbar} />
        ) : (
          <ShellNavbarCollapsedContent
            user={user}
            onCollapseNavbar={onCollapseNavbar}
          />
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="p-4">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
