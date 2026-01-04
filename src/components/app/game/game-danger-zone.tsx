import { Button } from '@/components/ui/button';
import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Title } from '@/components/ui/title';
import { Game } from '@/db/types';
import { deleteGame } from '@/functions/game/delete-game';
import { useRouter } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';

export interface GameDangerZoneProps {
  game: Game;
}

export function GameDangerZone({ game }: GameDangerZoneProps) {
  const router = useRouter();
  const notify = useNotifications();
  const openAsyncConfirmModel = useOpenAsyncConfirmModal();

  const openDeleteGameConfirmModal = () =>
    openAsyncConfirmModel({
      title: 'Confirm Game Deletion',
      children: (
        <p>
          Are you sure you want to delete {game.name}? This action is
          irreversible.
        </p>
      ),
      destructive: true,
      confirmLabel: 'Delete Game',
      onConfirm: async () => {
        await deleteGame({ data: { gameId: game.id } });
      },
      onSuccess: async () => {
        await router.navigate({ to: '/' });
        notify.success({
          title: `Deleted ${game.name}`,
          message: 'The game has been permanently deleted',
        });
      },
      onError: () => {
        notify.error({
          title: `Failed to delete ${game.name}`,
          message: 'Something went wrong. Please try again.',
        });
      },
    });

  return (
    <div>
      <Title order={4}>Danger Zone</Title>

      <Button
        destructive
        onClick={openDeleteGameConfirmModal}
        className="mt-2"
        leftSection={<Trash2 />}
      >
        Delete Game
      </Button>
    </div>
  );
}
