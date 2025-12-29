import { SessionUser } from '@/lib/auth';
import { updateUser } from '@/lib/auth/client';
import { AppShell } from '@mantine/core';
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

  const onToggle = async () => {
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
      padding="md"
      navbar={{
        width: opened ? 250 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Navbar>
        {opened ? (
          <ShellNavbarContent user={user} onToggle={onToggle} />
        ) : (
          <ShellNavbarCollapsedContent user={user} onToggle={onToggle} />
        )}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
