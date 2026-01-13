import { gameApiHandler, parseJson } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { createPlayerAuth } from '@/lib/player-auth';
import { created, unauthorized } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const zResBody = z.object({
  token: z.string(),
  player: zPlayer,
});

export async function POST({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return gameApiHandler({ gameId, request }, async ({ game }) => {
    const body = await parseJson(request, zReqBody);

    try {
      const playerAuth = createPlayerAuth(game);
      const { token, user: player } = await playerAuth.signInEmail({ body });

      const data = zResBody.parse({
        token,
        player: {
          ...player,
          createdAt: player.createdAt.toISOString(),
          updatedAt: player.updatedAt.toISOString(),
        },
      });
      return created(data);
    } catch {
      return unauthorized();
    }
  });
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/auth/sign-in/email',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
