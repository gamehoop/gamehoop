import logoDark from '@/assets/logo-full-dark.svg';
import logo from '@/assets/logo-full.svg';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { ActionIcon } from '@/components/ui/action-icon';
import { NavLink } from '@/components/ui/nav-link';
import { env } from '@/env/client';
import { useSessionContext } from '@/hooks/use-session-context';
import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Home, PanelLeftClose } from 'lucide-react';
import { ShellAvatarMenu } from './shell-avatar-menu';

export interface ShellNavbarContentProps {
  onCollapseNavbar: () => void;
}

export function ShellNavbarContent({
  onCollapseNavbar,
}: ShellNavbarContentProps) {
  const { user } = useSessionContext();
  return (
    <div className="flex flex-1 flex-col mt-4">
      <AnchorLink to="/" className="self-center ">
        <Image
          src={user.settings?.darkMode ? logoDark : logo}
          alt={env.VITE_APP_NAME}
          width={160}
          height={48}
        />
      </AnchorLink>

      <ul className="mt-4 border-t border-(--app-shell-border-color)">
        <NavLink component={Link} to="/" label="Home" leftSection={<Home />} />
      </ul>

      <ActionIcon
        variant="transparent"
        onClick={onCollapseNavbar}
        className="mt-auto self-end"
      >
        <PanelLeftClose className="text-(--mantine-color-text)" />
      </ActionIcon>

      <div className="mt-1 border-t border-(--app-shell-border-color)">
        <ShellAvatarMenu withDescription />
      </div>
    </div>
  );
}
