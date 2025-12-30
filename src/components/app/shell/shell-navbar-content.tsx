import logoDark from '@/assets/logo-full-dark.svg';
import logo from '@/assets/logo-full.svg';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { NavLink } from '@/components/app/ui/nav-link';
import { ActionIcon } from '@/components/ui/action-icon';
import { Avatar } from '@/components/ui/avatar';
import { useColorScheme } from '@/components/ui/hooks/use-color-scheme';
import { Menu } from '@/components/ui/menu';
import { env } from '@/env/client';
import { SessionUser } from '@/lib/auth';
import { updateUser } from '@/lib/auth/client';
import { Link, useRouter } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import {
  Book,
  Castle,
  Home,
  LogOut,
  Moon,
  PanelLeftClose,
  Sun,
  User,
} from 'lucide-react';

export interface ShellNavbarContentProps {
  user: SessionUser;
  onToggle: () => void;
}

export function ShellNavbarContent({
  user,
  onToggle,
}: ShellNavbarContentProps) {
  const router = useRouter();
  const { toggleColorScheme } = useColorScheme();

  const onThemeToggle = async () => {
    toggleColorScheme();

    await updateUser({
      settings: {
        ...user.settings,
        darkMode: !user.settings?.darkMode,
      },
    });
    await router.invalidate();
  };

  return (
    <div className="flex flex-1 flex-col mt-4">
      <AnchorLink to="/" className="self-center ">
        <Image
          src={user.settings?.darkMode ? logoDark : logo}
          alt={env.VITE_APP_NAME}
          width={148}
          height={48}
        />
      </AnchorLink>

      <ul className="mt-4 border-t border-(--app-shell-border-color)">
        <NavLink component={Link} to="/" label="Home" leftSection={<Home />} />
      </ul>

      <ActionIcon
        variant="transparent"
        onClick={onToggle}
        className="mt-auto self-end"
      >
        <PanelLeftClose className="text-(--mantine-color-text)" />
      </ActionIcon>

      <div className="mt-1 border-t border-(--app-shell-border-color)">
        <Menu position="right" withArrow>
          <Menu.Target>
            <NavLink
              className="m-4"
              label={user.name}
              description={user.email}
              leftSection={<Avatar />}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Link to="/account">
              <Menu.Item leftSection={<User />}>Account</Menu.Item>
            </Link>
            <Link to="/organization">
              <Menu.Item leftSection={<Castle />}>
                {user.organization.name}
              </Menu.Item>
            </Link>

            <a href="https://docs.gamehoop.io">
              <Menu.Item leftSection={<Book />}>Documentation</Menu.Item>
            </a>
            <Menu.Divider />

            {user.settings?.darkMode ? (
              <Menu.Item leftSection={<Sun />} onClick={onThemeToggle}>
                Light Mode
              </Menu.Item>
            ) : (
              <Menu.Item leftSection={<Moon />} onClick={onThemeToggle}>
                Dark Mode
              </Menu.Item>
            )}

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
