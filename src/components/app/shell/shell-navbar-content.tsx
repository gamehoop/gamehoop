import logo from '@/assets/logo-full.png';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { env } from '@/env/client';
import { SessionUser } from '@/lib/auth';
import { ActionIcon, Avatar, Menu, NavLink } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Home, LogOut, PanelLeftClose, User } from 'lucide-react';

export interface ShellNavbarContentProps {
  user: SessionUser;
  onToggle: () => void;
}

export function ShellNavbarContent({
  user,
  onToggle,
}: ShellNavbarContentProps) {
  return (
    <div className="flex flex-1 flex-col mt-4">
      <AnchorLink to="/" className="self-center">
        <Image src={logo} alt={env.VITE_APP_NAME} width={148} height={48} />
      </AnchorLink>

      <ul className="mt-4 border-t border-(--app-shell-border-color)">
        <NavLink component={Link} to="/" label="Home" leftSection={<Home />} />
      </ul>

      <ActionIcon
        variant="transparent"
        color="black"
        onClick={onToggle}
        className="mt-auto self-end"
      >
        <PanelLeftClose />
      </ActionIcon>

      <div className="border-t border-(--app-shell-border-color)">
        <Menu shadow="md" width={200} position="top" withArrow>
          <Menu.Target>
            <NavLink
              label={user.name}
              description={user.name}
              leftSection={<Avatar />}
            />
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
