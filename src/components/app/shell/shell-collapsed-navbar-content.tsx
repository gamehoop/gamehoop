import logo from '@/assets/logo.svg';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { ActionIcon } from '@/components/ui/action-icon';
import { Tooltip } from '@/components/ui/tooltip';
import { env } from '@/env/client';
import { useSessionContext } from '@/hooks/use-session-context';
import { themeColor } from '@/styles/theme';
import { Link, useLocation } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Cog, Home, PanelLeftOpen, Users } from 'lucide-react';
import { ShellAvatarMenu } from './shell-avatar-menu';
import { ShellCollapsedGameMenu } from './shell-collapsed-game-menu';

export interface ShellNavbarCollapsedContentProps {
  onCollapseNavbar: () => void;
}

export function ShellNavbarCollapsedContent({
  onCollapseNavbar,
}: ShellNavbarCollapsedContentProps) {
  const {
    activeOrganization: { activeGame },
  } = useSessionContext();
  const location = useLocation();
  return (
    <div className="flex flex-1 flex-col items-center mt-4">
      <AnchorLink to="/" className="self-center">
        <Image src={logo} alt={env.VITE_APP_NAME} width={34} height={34} />
      </AnchorLink>

      <ShellCollapsedGameMenu />

      <ul className="flex w-full items-center flex-col pt-4 gap-4">
        <Tooltip label="Home" position="right" withArrow>
          <Link to="/" activeProps={{ style: { color: themeColor } }}>
            <ActionIcon variant="default" size="lg">
              <Home
                className="text-xl"
                style={{
                  color: location.pathname === '/' ? themeColor : undefined,
                }}
              />
            </ActionIcon>
          </Link>
        </Tooltip>

        <Tooltip label="Players" position="right" withArrow>
          <Link
            to={`/games/$gameId/players`}
            params={{ gameId: activeGame?.publicId ?? '' }}
            activeProps={{ style: { color: themeColor } }}
            disabled={!activeGame}
          >
            <ActionIcon variant="default" size="lg" disabled={!activeGame}>
              <Users
                className="text-xl"
                style={{
                  color: location.pathname.startsWith(
                    `/games/${activeGame?.publicId}/players`,
                  )
                    ? themeColor
                    : undefined,
                }}
              />
            </ActionIcon>
          </Link>
        </Tooltip>

        <Tooltip label="Configuration" position="right" withArrow>
          <Link
            to={`/games/$gameId`}
            params={{ gameId: activeGame?.publicId ?? '' }}
            activeProps={{ style: { color: themeColor } }}
            disabled={!activeGame}
          >
            <ActionIcon variant="default" size="lg" disabled={!activeGame}>
              <Cog
                className="text-xl"
                style={{
                  color:
                    location.pathname === `/games/${activeGame?.publicId}`
                      ? themeColor
                      : undefined,
                }}
              />
            </ActionIcon>
          </Link>
        </Tooltip>
      </ul>

      <ActionIcon
        variant="transparent"
        onClick={onCollapseNavbar}
        className="mt-auto"
      >
        <PanelLeftOpen className="text-(--mantine-color-text)" />
      </ActionIcon>

      <ShellAvatarMenu />
    </div>
  );
}
