import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { GameEvent } from '@/db/types';
import { deleteGameEvent } from '@/functions/game/events/delete-game-event';
import { useRouter } from '@tanstack/react-router';

export function useDeleteGameEventModal() {
  const router = useRouter();
  const notify = useNotifications();
  const openAsyncConfirmModal = useOpenAsyncConfirmModal();

  return (event: GameEvent) =>
    openAsyncConfirmModal({
      title: `Delete Event "${event.name}"`,
      children: <p>Are you sure you delete the event "{event.name}"?</p>,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        await deleteGameEvent({
          data: { gameId: event.gameId, eventId: event.id },
        });
      },
      onSuccess: async () => {
        await router.navigate({
          to: '/games/$gameId/events',
          params: { gameId: event.gameId },
        });
        notify.success({
          title: 'Event Deleted',
          message: `Successfully deleted event.`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to delete event',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
}
