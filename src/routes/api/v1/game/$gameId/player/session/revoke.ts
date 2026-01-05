import { parseJson, verifyApiAccess } from '@/domain/api';
import { logError } from '@/lib/logger';
import { playerSessionStore } from '@/stores/player-session-store';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zBody = z.object({
  token: z.string().min(32),
});

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/session/revoke',
)({
  server: {
    handlers: {
      DELETE: async ({ params: { gameId: gamePublicId }, request }) => {
        try {
          const { game } = await verifyApiAccess(request, {
            gamePublicId,
          });

          const body = await parseJson(request, zBody);

          const sessions = await playerSessionStore.listForGame(game.id);
          const session = sessions.find((s) => s.token === body.token);
          if (!session) {
            return new Response('', { status: HttpStatus.NotFound });
          }

          await playerSessionStore.deleteById(session.id);
          return new Response('', { status: HttpStatus.NoContent });
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
