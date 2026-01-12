import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Game, Player, PlayerSession } from '@/db/types';
import { revokePlayerSession } from '@/functions/game/players/revoke-player-session';

export function useRevokePlayerSessionModal() {
  const notify = useNotifications();
  const openAsyncConfirmModal = useOpenAsyncConfirmModal();

  return ({
    game,
    player,
    session,
  }: {
    game: Game;
    player: Player;
    session: PlayerSession;
  }) =>
    openAsyncConfirmModal({
      title: 'Revoke Session',
      children: <p>Are you sure you revoke this session?</p>,
      confirmLabel: 'Revoke',
      destructive: true,
      onConfirm: async () => {
        await revokePlayerSession({
          data: {
            gameId: game.id,
            playerId: player.id,
            sessionId: session.id,
          },
        });
      },
      onSuccess: () => {
        notify.success({
          title: 'Session Deleted',
          message: `Successfully deleted the session.`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to delete session',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
}
