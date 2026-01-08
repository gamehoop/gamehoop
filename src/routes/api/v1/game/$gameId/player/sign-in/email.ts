import { parseJson, withGameAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { created, unauthorized } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export async function POST({
  params: { gameId: gamePublicId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return withGameAccess({ gamePublicId, request }, async ({ game }) => {
    const body = await parseJson(
      request,
      z.object({
        email: z.email(),
        password: z.string().min(8),
      }),
    );

    try {
      const { token, user: player } = await createPlayerAuth(
        game.id,
      ).api.signInEmail({ body });

      const data = { token, player };
      return created(data);
    } catch {
      return unauthorized();
    }
  });
}

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/sign-in/email',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
