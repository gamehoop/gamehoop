import { withPlayerAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export async function POST({
  params: { gameId: gamePublicId, playerId },
  request,
}: {
  params: { gameId: string; playerId: string };
  request: Request;
}) {
  return withPlayerAccess(
    { gamePublicId, playerId, request },
    async ({ game, player }) => {
      const data = await createPlayerAuth(game.id).api.requestPasswordReset({
        body: {
          email: player.email,
          redirectTo: `/player/reset-password`,
        },
      });

      return ok(data);
    },
  );
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/players/$playerId/reset-password',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
