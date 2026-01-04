import { verifyApiAccess } from '@/domain/api';
import { logError } from '@/lib/logger';
import { createPlayerAuth } from '@/lib/player-auth';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/session/guest',
)({
  server: {
    handlers: {
      POST: async ({ params: { gameId: gamePublicId }, request }) => {
        try {
          const { game } = await verifyApiAccess(request, { gamePublicId });

          const session = await createPlayerAuth(game.id).api.signInAnonymous();
          if (!session) {
            return Response.json(
              { error: 'Failed to create guest session' },
              { status: HttpStatus.ServerError },
            );
          }

          const data = { token: session.token, player: session.user };
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
