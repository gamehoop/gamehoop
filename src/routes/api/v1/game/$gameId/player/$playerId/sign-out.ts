import { verifyApiAccess } from '@/domain/api';
import { logError } from '@/lib/logger';
import { playerSessionStore } from '@/stores/player-session-store';
import { playerStore } from '@/stores/player-store';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/$playerId/sign-out',
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

          await playerSessionStore.deleteByPlayerId(playerId);

          return new Response('', { status: HttpStatus.Ok });
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
