import { withPlayerAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/$playerId/reset-password',
)({
  server: {
    handlers: {
      POST: async ({ params: { gameId: gamePublicId, playerId }, request }) => {
        return withPlayerAccess(
          { gamePublicId, playerId, request },
          async ({ game, player }) => {
            const data = await createPlayerAuth(
              game.id,
            ).api.requestPasswordReset({
              body: {
                email: player.email,
                redirectTo: `/player/reset-password`,
              },
            });

            return ok(data);
          },
        );
      },
    },
  },
});
