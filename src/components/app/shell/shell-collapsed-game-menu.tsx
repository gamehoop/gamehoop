import { Avatar } from '@/components/ui/avatar';
import { Menu } from '@/components/ui/menu';
import { Tooltip } from '@/components/ui/tooltip';
import { useSessionContext } from '@/hooks/use-session-context';
import { themeColor } from '@/styles/theme';
import { cn } from '@/utils/styles';
import { ActionIcon } from '@mantine/core';
import { CircleChevronDown, Gamepad2 } from 'lucide-react';
import { useCreateGameModal } from '../game/use-create-game-modal';
import { useSwitchGameModal } from '../game/use-switch-game-modal';

export function ShellCollapsedGameMenu() {
  const {
    activeOrganization: { games, activeGame },
  } = useSessionContext();
  const openCreateGameModal = useCreateGameModal();
  const openSwitchGameModal = useSwitchGameModal();

  return (
    <div
      className={cn(
        'w-full',
        !activeGame &&
          'mt-4 border-y border-(--app-shell-border-color) h-18.75 flex items-center justify-center',
      )}
    >
      {activeGame ? (
        <Menu position="right" withArrow>
          <Menu.Target>
            <Tooltip label={activeGame.name} position="right" withArrow>
              <div className="mt-4 border-y border-(--app-shell-border-color) h-18.75 flex items-center justify-center dark:hover:bg-(--mantine-color-dark-6) hover:bg-(--mantine-color-gray-0) cursor-pointer">
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
              </div>
            </Tooltip>
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
        <Tooltip label="Create New Game" position="right" withArrow>
          <ActionIcon size="lg" onClick={openCreateGameModal}>
            <Gamepad2 className="text-xl" />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Tooltip label="Choose Game" position="right" withArrow>
          <ActionIcon size="lg" onClick={openSwitchGameModal}>
            <CircleChevronDown className="text-xl" />
          </ActionIcon>
        </Tooltip>
      )}
    </div>
  );
}
