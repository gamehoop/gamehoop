import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Player } from '@/db/types';
import { deletePlayer } from '@/functions/game/players/delete-player';

export function useDeletePlayerModal() {
  const notify = useNotifications();
  const openAsyncConfirmModal = useOpenAsyncConfirmModal();

  return (player: Player) =>
    openAsyncConfirmModal({
      title: `Delete Player "${player.name}"`,
      children: <p>Are you sure you delete the player "{player.name}"?</p>,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        await deletePlayer({
          data: { gameId: player.gameId, playerId: player.id },
        });
      },
      onSuccess: () => {
        notify.success({
          title: 'Player Deleted',
          message: `Successfully deleted player.`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to delete player',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
}
