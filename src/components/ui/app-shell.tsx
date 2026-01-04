import { AppShell as BaseAppShell } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface AppShellProps extends PropsWithChildren {
  className?: string;
  navbar?: {
    breakpoint: string;
    collapsed?: { desktop?: boolean; mobile?: boolean };
    width: number;
  };
}

export function AppShell(props: AppShellProps) {
  return <BaseAppShell {...props} />;
}

export interface AppShellNavbarProps extends PropsWithChildren {
  className?: string;
}

AppShell.Navbar = function ShellNavbar(props: AppShellNavbarProps) {
  return <BaseAppShell.Navbar {...props} />;
};

export interface AppShellMainProps extends PropsWithChildren {
  className?: string;
}

AppShell.Main = function AppShellMain(props: AppShellMainProps) {
  return <BaseAppShell.Main {...props} />;
};
