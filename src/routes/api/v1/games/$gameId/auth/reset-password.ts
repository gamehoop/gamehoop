import { gameApiHandler, parseJson } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { playerStore } from '@/stores/player-store';
import { badRequest, ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({ email: z.email() });

export async function POST({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return gameApiHandler({ gameId, request }, async ({ game }) => {
    const { email } = await parseJson(request, zReqBody);

    const player = await playerStore.findOne({ where: { email } });
    if (!player) {
      return badRequest({ error: 'A player with that email does not exist.' });
    }

    const playerAuth = createPlayerAuth(game);
    await playerAuth.requestPasswordReset({
      body: {
        email,
        redirectTo: `/games/${game.id}/reset-password`,
      },
    });

    return ok();
  });
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/auth/reset-password',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
