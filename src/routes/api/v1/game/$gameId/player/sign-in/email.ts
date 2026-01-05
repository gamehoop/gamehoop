import { parseJson, withGameAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { created } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zBody = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/sign-in/email',
)({
  server: {
    handlers: {
      POST: async ({ params: { gameId: gamePublicId }, request }) => {
        return withGameAccess({ gamePublicId, request }, async ({ game }) => {
          const body = await parseJson(request, zBody);

          const { token, user: player } = await createPlayerAuth(
            game.id,
          ).api.signInEmail({ body });

          const data = { token, player };
          return created(data);
        });
      },
    },
  },
});
