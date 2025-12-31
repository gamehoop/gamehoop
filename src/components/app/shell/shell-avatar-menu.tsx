import { Avatar } from '@/components/ui/avatar';
import { useColorScheme } from '@/components/ui/hooks/use-color-scheme';
import { Menu } from '@/components/ui/menu';
import { NavLink } from '@/components/ui/nav-link';
import { User } from '@/lib/auth';
import { updateUser } from '@/lib/auth/client';
import { Link, useRouter } from '@tanstack/react-router';
import { Book, Castle, LogOut, Moon, Sun, UserIcon } from 'lucide-react';

export interface ShellAvatarMenuProps {
  user: User;
  withDescription?: boolean;
}

export function ShellAvatarMenu({
  user,
  withDescription,
}: ShellAvatarMenuProps) {
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
    <Menu position="right" withArrow>
      <Menu.Target>
        {withDescription ? (
          <NavLink
            label={user.name}
            description={user.email}
            leftSection={
              <Avatar
                src={user.image ? `/api/user/avatar?url=${user.image}` : ''}
              />
            }
            size="md"
            className="h-18.75"
          />
        ) : (
          <div className="mt-1 h-18.75 flex items-center justify-center border-t border-(--app-shell-border-color) w-full dark:hover:bg-(--mantine-color-dark-6) hover:bg-(--mantine-color-gray-0) cursor-pointer">
            <Avatar
              src={user.image ? `/api/user/avatar?url=${user.image}` : ''}
            />
          </div>
        )}
      </Menu.Target>

      <Menu.Dropdown>
        <Link to="/account">
          <Menu.Item leftSection={<UserIcon />}>Account</Menu.Item>
        </Link>
        <Link to="/organization">
          <Menu.Item leftSection={<Castle />}>Organization</Menu.Item>
        </Link>

        <a href="https://docs.gamehoop.io" target="_blank" rel="noreferrer">
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
  );
}
