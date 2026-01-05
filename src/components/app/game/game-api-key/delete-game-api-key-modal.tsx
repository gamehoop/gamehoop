import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { GameApiKey } from '@/db/types';
import { deleteGameApiKey } from '@/functions/game/game-api-key/delete-game-api-key';

export function useDeleteGameApiKeyModal() {
  const notify = useNotifications();
  const openAsyncConfirmModal = useOpenAsyncConfirmModal();

  return (gameApiKey: GameApiKey) =>
    openAsyncConfirmModal({
      title: 'Delete API Key',
      children: <p>Are you sure you delete this API key?</p>,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        await deleteGameApiKey({
          data: { gameApiKeyId: gameApiKey.id, gameId: gameApiKey.gameId },
        });
      },
      onSuccess: () => {
        notify.success({
          title: 'API Key Deleted',
          message: `Successfully deleted the API key.`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to delete API key',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
}
