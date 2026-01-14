import { gameApiHandler, parseJson } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { createPlayerAuth } from '@/lib/player-auth';
import { created } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zResBody = z.object({
  token: z.string().nullable(),
  player: zPlayer,
});

export async function POST({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}): Promise<Response> {
  return gameApiHandler({ gameId, request }, async ({ game }) => {
    const zReqBody = z.object({
      email: z.email(),
      password: z.string().min(game.settings?.auth?.minPasswordLength ?? 8),
      name: z.string().min(1),
    });

    const body = await parseJson(request, zReqBody);

    const playerAuth = createPlayerAuth(game);
    const { token, user: player } = await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: `/games/${game.id}/email-verified?email=${encodeURIComponent(body.email)}`,
        ...body,
      },
    });

    const data = zResBody.parse({
      token,
      player: {
        ...player,
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
      },
    });

    return created(data);
  });
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/auth/sign-up/email',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
