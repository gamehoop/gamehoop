import { parseJson, verifyApiAccess } from '@/domain/api';
import { logError } from '@/lib/logger';
import { createPlayerAuth } from '@/lib/player-auth';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zBody = z.object({
  email: z.email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

export const Route = createFileRoute('/api/v1/game/$gameId/player/sign-in')({
  server: {
    handlers: {
      POST: async ({ params: { gameId: gamePublicId }, request }) => {
        try {
          const { game } = await verifyApiAccess(request, { gamePublicId });
          const body = await parseJson(request, zBody);

          const { token, user } = await createPlayerAuth(
            game.id,
          ).api.signInEmail({ body });

          const data = { token, player: user };
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
