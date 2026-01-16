import { gameApiHandler, parseJson } from '@/domain/api';
import { createPlayerAuth } from '@/libs/player-auth';
import { playerRepo } from '@/repos/player-repo';
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
}): Promise<Response> {
  return gameApiHandler({ gameId, request }, async ({ game }) => {
    const { email } = await parseJson(request, zReqBody);

    const player = await playerRepo.findOne({ where: { email } });
    if (!player) {
      return badRequest({
        error: 'A player with that email does not exist.',
      });
    }

    const playerAuth = createPlayerAuth(game);
    await playerAuth.sendVerificationEmail({
      body: {
        email,
        callbackURL: `/games/${game.id}/email-verified`,
      },
    });

    return ok();
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
