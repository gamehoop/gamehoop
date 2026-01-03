import logoDark from '@/assets/logo-full-dark.svg';
import logo from '@/assets/logo-full.svg';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { ActionIcon } from '@/components/ui/action-icon';
import { NavLink } from '@/components/ui/nav-link';
import { env } from '@/env/client';
import { useSessionContext } from '@/hooks/use-session-context';
import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Cog, Home, PanelLeftClose, Users } from 'lucide-react';
import { ShellAvatarMenu } from './shell-avatar-menu';
import { ShellGameMenu } from './shell-game-menu';

export interface ShellNavbarContentProps {
  onCollapseNavbar: () => void;
}

export function ShellNavbarContent({
  onCollapseNavbar,
}: ShellNavbarContentProps) {
  const {
    user,
    activeOrganization: { activeGame },
  } = useSessionContext();

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

      <ShellGameMenu />

      <ul>
        <NavLink component={Link} to="/" label="Home" leftSection={<Home />} />
        <NavLink
          component={Link}
          to="/players"
          label="Players"
          leftSection={<Users />}
          disabled={!activeGame}
        />
        <NavLink
          component={Link}
          to="/game"
          label="Configuration"
          leftSection={<Cog />}
          disabled={!activeGame}
        />
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
