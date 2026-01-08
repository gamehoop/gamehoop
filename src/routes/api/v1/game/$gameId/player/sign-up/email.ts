import { parseJson, withGameAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { created } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export function POST({
  params: { gameId: gamePublicId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}): Promise<Response> {
  return withGameAccess({ gamePublicId, request }, async ({ game }) => {
    const body = await parseJson(
      request,
      z.object({
        email: z.email(),
        password: z.string().min(8),
        name: z.string().min(1),
      }),
    );

    const { token, user } = await createPlayerAuth(game.id).api.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '/player-verified',
        ...body,
      },
    });

    const data = { token, player: user };
    return created(data);
  });
}

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/sign-up/email',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
