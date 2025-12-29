import logo from '@/assets/logo.png';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { env } from '@/env/client';
import { SessionUser } from '@/lib/auth';
import { themeColor } from '@/styles/theme';
import { ActionIcon, Avatar, Menu, Tooltip } from '@mantine/core';
import { Link, useLocation } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Home, LogOut, PanelLeftOpen, User } from 'lucide-react';

export interface ShellNavbarCollapsedContentProps {
  user: SessionUser;
  onToggle: () => void;
}

export function ShellNavbarCollapsedContent({
  onToggle,
}: ShellNavbarCollapsedContentProps) {
  const location = useLocation();

  return (
    <div className="flex flex-1 flex-col items-center mt-4">
      <AnchorLink to="/" className="self-center">
        <Image src={logo} alt={env.VITE_APP_NAME} width={48} height={48} />
      </AnchorLink>

      <ul className="flex w-full items-center flex-col mt-4 pt-2 gap-2 border-t border-(--app-shell-border-color)">
        <Tooltip label="Home" position="right" withArrow>
          <ActionIcon
            variant="subtle"
            color={location.pathname === '/' ? themeColor : 'black'}
            size="lg"
            className="mt-auto"
          >
            <Link to="/">
              <Home className="text-xl" />
            </Link>
          </ActionIcon>
        </Tooltip>
      </ul>

      <ActionIcon
        variant="transparent"
        color="black"
        onClick={onToggle}
        className="mt-auto"
      >
        <PanelLeftOpen />
      </ActionIcon>

      <div className="flex items-center justify-center py-2 border-t border-(--app-shell-border-color) w-full">
        <Menu shadow="md" width={200} position="right" withArrow>
          <Menu.Target>
            <Avatar className="cursor-pointer" />
          </Menu.Target>

          <Menu.Dropdown>
            <Link to="/account">
              <Menu.Item leftSection={<User />}>Account</Menu.Item>
            </Link>
            <Menu.Divider />
            <Link to="/sign-out">
              <Menu.Item leftSection={<LogOut />}>Sign Out</Menu.Item>
            </Link>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
}
