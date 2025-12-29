import logo from '@/assets/logo-full.png';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { env } from '@/env/client';
import { SessionUser } from '@/lib/auth';
import { ActionIcon, Avatar, NavLink } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Home, PanelLeftClose } from 'lucide-react';

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
        <NavLink
          href="/account"
          label={user.name}
          description={user.name}
          leftSection={<Avatar />}
        />
      </div>
    </div>
  );
}
