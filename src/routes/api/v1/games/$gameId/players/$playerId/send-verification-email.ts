import { withPlayerAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/api/v1/games/$gameId/players/$playerId/send-verification-email',
)({
  server: {
    handlers: {
      POST: async ({ params: { gameId: gamePublicId, playerId }, request }) => {
        return withPlayerAccess(
          { gamePublicId, playerId, request },
          async ({ game, player }) => {
            const data = await createPlayerAuth(
              game.id,
            ).api.sendVerificationEmail({
              body: {
                email: player.email,
                callbackURL: '/player-verified',
              },
            });

            return ok(data);
          },
        );
      },
    },
  },
});
