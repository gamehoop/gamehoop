import logo from '@/assets/logo.png';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { useColorScheme } from '@/components/ui/hooks/use-color-scheme';
import { env } from '@/env/client';
import { SessionUser } from '@/lib/auth';
import { updateUser } from '@/lib/auth/client';
import { themeColor } from '@/styles/theme';
import { ActionIcon, Avatar, Menu, Tooltip } from '@mantine/core';
import { Link, useRouter } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Home, LogOut, Moon, PanelLeftOpen, Sun, User } from 'lucide-react';

export interface ShellNavbarCollapsedContentProps {
  user: SessionUser;
  onToggle: () => void;
}

export function ShellNavbarCollapsedContent({
  user,
  onToggle,
}: ShellNavbarCollapsedContentProps) {
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
    <div className="flex flex-1 flex-col items-center mt-4">
      <AnchorLink to="/" className="self-center">
        <Image src={logo} alt={env.VITE_APP_NAME} width={48} height={48} />
      </AnchorLink>

      <ul className="flex w-full items-center flex-col mt-4 pt-4 gap-4 border-t border-(--app-shell-border-color)">
        <Tooltip label="Home" position="right" withArrow>
          <ActionIcon variant="default" size="lg">
            <Link to="/" activeProps={{ style: { color: themeColor } }}>
              <Home className="text-xl" />
            </Link>
          </ActionIcon>
        </Tooltip>
      </ul>

      <ActionIcon variant="transparent" onClick={onToggle} className="mt-auto ">
        <PanelLeftOpen className="text-(--mantine-color-text)" />
      </ActionIcon>

      <Menu shadow="md" width={200} position="right" withArrow>
        <Menu.Target>
          <div className="mt-1 flex items-center justify-center border-t border-(--app-shell-border-color) w-full dark:hover:bg-(--mantine-color-dark-6) hover:bg-(--mantine-color-gray-0) cursor-pointer">
            <Avatar m="md" />
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Link to="/account">
            <Menu.Item leftSection={<User />}>Account</Menu.Item>
          </Link>
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
  );
}
