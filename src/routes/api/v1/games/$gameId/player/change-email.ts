import { parseJson, playerApiHandler } from '@/domain/api';
import { createPlayerAuth } from '@/libs/player-auth';
import { ok, unauthorized } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export async function POST({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ game }) => {
    if (!request.headers.get('Cookie')) {
      return unauthorized();
    }

    const { newEmail } = await parseJson(
      request,
      z.object({ newEmail: z.email() }),
    );

    const playerAuth = createPlayerAuth(game);
    await playerAuth.changeEmail({
      body: {
        newEmail,
        callbackURL: `/games/${game.id}/change-email-requested`,
      },
      headers: request.headers,
    });

    return ok();
  });
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/player/change-email',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
