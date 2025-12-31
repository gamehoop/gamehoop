import logo from '@/assets/logo.png';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { ActionIcon } from '@/components/ui/action-icon';
import { Tooltip } from '@/components/ui/tooltip';
import { env } from '@/env/client';
import { Organization, User } from '@/lib/auth';
import { themeColor } from '@/styles/theme';
import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Home, PanelLeftOpen } from 'lucide-react';
import { ShellAvatarMenu } from './shell-avatar-menu';

export interface ShellNavbarCollapsedContentProps {
  user: User;
  organizations: Organization[];
  onCollapseNavbar: () => void;
}

export function ShellNavbarCollapsedContent({
  user,
  organizations,
  onCollapseNavbar,
}: ShellNavbarCollapsedContentProps) {
  return (
    <div className="flex flex-1 flex-col items-center mt-4">
      <AnchorLink to="/" className="self-center">
        <Image src={logo} alt={env.VITE_APP_NAME} width={34} height={34} />
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

      <ActionIcon
        variant="transparent"
        onClick={onCollapseNavbar}
        className="mt-auto"
      >
        <PanelLeftOpen className="text-(--mantine-color-text)" />
      </ActionIcon>

      <ShellAvatarMenu user={user} organizations={organizations} />
    </div>
  );
}
