import { parseJson, withGameAccess } from '@/domain/api';
import { playerSessionStore } from '@/stores/player-session-store';
import { noContent, notFound } from '@/utils/http';
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
        return withGameAccess({ gamePublicId, request }, async () => {
          const { token } = await parseJson(request, zBody);

          const sessions = await playerSessionStore.findMany({
            where: { token },
          });
          if (!sessions.length) {
            return notFound();
          }

          await playerSessionStore.deleteMany({
            where: { token },
          });
          return noContent();
        });
      },
    },
  },
});
