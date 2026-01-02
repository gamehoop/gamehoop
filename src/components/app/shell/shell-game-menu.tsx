import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/ui/menu';
import { NavLink } from '@/components/ui/nav-link';
import { useSessionContext } from '@/hooks/use-session-context';
import { themeColor } from '@/styles/theme';
import { CircleChevronDown, Gamepad2 } from 'lucide-react';
import { useCreateGameModal } from '../game/use-create-game-modal';
import { useSwitchGameModal } from '../game/use-switch-game-modal';

export function ShellGameMenu() {
  const {
    activeOrganization: { games, activeGame },
  } = useSessionContext();
  const openCreateGameModal = useCreateGameModal();
  const openSwitchGameModal = useSwitchGameModal();

  return (
    <div className="mt-4 border-t border-b border-(--app-shell-border-color) h-18.75 flex items-center justify-center">
      {activeGame ? (
        <Menu position="right" withArrow>
          <Menu.Target>
            <NavLink
              label={activeGame.name}
              leftSection={
                <Avatar
                  variant="light"
                  color={themeColor}
                  src={
                    activeGame.logo
                      ? `/api/games/${activeGame.id}/logo?updatedAt=${activeGame.updatedAt.toString()}`
                      : ''
                  }
                >
                  <Gamepad2 className="text-2xl" />
                </Avatar>
              }
              size="md"
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<Gamepad2 />} onClick={openCreateGameModal}>
              Create Game
            </Menu.Item>
            <Menu.Item
              leftSection={<CircleChevronDown />}
              onClick={openSwitchGameModal}
              disabled={games.length === 1}
            >
              Switch Game
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : !games.length ? (
        <Button leftSection={<Gamepad2 />} onClick={openCreateGameModal}>
          Create Game
        </Button>
      ) : (
        <Button
          leftSection={<CircleChevronDown />}
          onClick={openSwitchGameModal}
        >
          Choose Game
        </Button>
      )}
    </div>
  );
}
