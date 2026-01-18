import { parseJson, playerApiHandler } from '@/domain/api';
import { createPlayerAuth } from '@/libs/player-auth';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import { APIError } from 'better-auth';
import z from 'zod';

const zReqBody = z.object({ newEmail: z.email() });

export async function POST({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ game, headers }) => {
    const { newEmail } = await parseJson(request, zReqBody);

    try {
      await createPlayerAuth(game).changeEmail({
        body: {
          newEmail,
          callbackURL: `/games/${game.id}/change-email-requested`,
        },
        headers,
      });

      return ok();
    } catch (error) {
      if (error instanceof APIError) {
        return Response.json(
          { error: error.message },
          { status: error.statusCode },
        );
      }

      throw error;
    }
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
