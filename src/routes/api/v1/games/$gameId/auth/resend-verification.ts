import { gameApiHandler, parseJson } from '@/domain/api';
import { logError } from '@/libs/logger';
import { createPlayerAuth } from '@/libs/player-auth';
import { playerRepo } from '@/repos/player-repo';
import { badRequest, ok, serverError } from '@/utils/http';
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
}): Promise<Response> {
  return gameApiHandler({ gameId, request }, async ({ game }) => {
    const { email } = await parseJson(request, zReqBody);

    const player = await playerRepo.findOne({ where: { email } });
    if (!player) {
      return badRequest({
        error: 'A player with that email does not exist.',
      });
    }

    try {
      await createPlayerAuth(game).sendVerificationEmail({
        body: {
          email,
          callbackURL: `/games/${game.id}/email-verified`,
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

      logError(error);
      return serverError();
    }
  });
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/auth/resend-verification',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
