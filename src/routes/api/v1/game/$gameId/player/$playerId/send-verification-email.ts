import { verifyApiAccess } from '@/domain/api';
import { logError } from '@/lib/logger';
import { createPlayerAuth } from '@/lib/player-auth';
import { playerStore } from '@/stores/player-store';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/$playerId/send-verification-email',
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

          const data = await createPlayerAuth(
            game.id,
          ).api.sendVerificationEmail({
            body: {
              email: player.email,
              callbackURL: '/player-verified',
            },
          });

          return Response.json(data, { status: HttpStatus.Ok });
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
