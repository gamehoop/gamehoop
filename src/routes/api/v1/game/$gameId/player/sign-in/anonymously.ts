import { parseJson, withGameAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { playerSessionStore } from '@/stores/player-session-store';
import { playerStore } from '@/stores/player-store';
import { created, serverError } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zBody = z.object({
  playerId: z.string().optional(),
});

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/sign-in/anonymously',
)({
  server: {
    handlers: {
      POST: async ({ params: { gameId: gamePublicId }, request }) => {
        return withGameAccess({ gamePublicId, request }, async ({ game }) => {
          const { playerId } = await parseJson(request, zBody);

          const session = await createPlayerAuth(game.id).api.signInAnonymous();
          if (!session) {
            return serverError({ error: 'Failed to create anonymous session' });
          }

          if (playerId) {
            const playerSession = await playerSessionStore.findOneOrThrow({
              where: { token: session.token },
            });
            await playerSessionStore.updateMany({
              where: { id: playerSession.id },
              data: {
                userId: playerId,
              },
            });
            await playerStore.deleteMany({
              where: { id: playerSession.userId },
            });
          }

          const { token, user: player } = session;
          const data = {
            token,
            player: {
              ...player,
              id: playerId ?? player.id,
            },
          };

          return created(data);
        });
      },
    },
  },
});
