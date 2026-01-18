import { gameApiHandler, parseJson } from '@/domain/api';
import { createPlayerAuth } from '@/libs/player-auth';
import { playerRepo } from '@/repos/player-repo';
import { ok, unprocessableEntity } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import { APIError } from 'better-auth';
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

    const player = await playerRepo.findOne({ where: { email } });
    if (!player) {
      return unprocessableEntity({
        error: `A player with email ${email} does not exist.`,
      });
    }

    try {
      await createPlayerAuth(game).requestPasswordReset({
        body: {
          email,
          redirectTo: `/games/${game.id}/reset-password`,
        },
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
  '/api/v1/games/$gameId/auth/reset-password',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
