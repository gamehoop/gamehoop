import { withPlayerSessionAccess } from '@/domain/api';
import { playerSessionStore } from '@/stores/player-session-store';
import { noContent } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export async function DELETE({
  params: { gameId, playerId },
  request,
}: {
  params: { gameId: string; playerId: string };
  request: Request;
}) {
  return withPlayerSessionAccess(
    { gameId, playerId, request },
    async ({ session }) => {
      await playerSessionStore.deleteMany({
        where: { token: session.token },
      });
      return noContent();
    },
  );
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/players/$playerId/sign-out',
)({
  server: {
    handlers: {
      DELETE,
    },
  },
});
