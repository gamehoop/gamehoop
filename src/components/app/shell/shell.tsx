import { SessionUser } from '@/lib/auth';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PropsWithChildren } from 'react';
import { ShellNavbarCollapsedContent } from './shell-collapsed-navbar-content';
import { ShellNavbarContent } from './shell-navbar-content';

export interface ShellProps extends PropsWithChildren {
  user: SessionUser;
}

export function Shell({ user, children }: ShellProps) {
  const [opened, { toggle }] = useDisclosure(true);

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
          <ShellNavbarContent user={user} onToggle={toggle} />
        ) : (
          <ShellNavbarCollapsedContent user={user} onToggle={toggle} />
        )}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
