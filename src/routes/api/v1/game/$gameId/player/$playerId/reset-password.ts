import { verifyApiAccess } from '@/domain/api';
import { logError } from '@/lib/logger';
import { createPlayerAuth } from '@/lib/player-auth';
import { playerStore } from '@/stores/player-store';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/$playerId/reset-password',
)({
  server: {
    handlers: {
      POST: async ({ params: { gameId: gamePublicId, playerId }, request }) => {
        try {
          const { game } = await verifyApiAccess(request, {
            gamePublicId,
          });

          const player = await playerStore.getById(playerId, game.id);
          if (!player) {
            throw new Response('Player not found', {
              status: HttpStatus.NotFound,
            });
          }

          const data = await createPlayerAuth(game.id).api.requestPasswordReset(
            {
              body: {
                email: player.email,
                redirectTo: `/player/reset-password`,
              },
            },
          );

          return Response.json(data, { status: HttpStatus.Created });
        } catch (error) {
          logError(error);
          if (error instanceof Response) {
            return error;
          }
          return new Response('', { status: HttpStatus.ServerError });
        }
      },
    },
  },
});
