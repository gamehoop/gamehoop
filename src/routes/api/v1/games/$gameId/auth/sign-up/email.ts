import { gameApiHandler, parseJson, parseSessionToken } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { logError } from '@/libs/logger';
import { createPlayerAuth } from '@/libs/player-auth';
import { created, serverError } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import { APIError } from 'better-auth';
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
    const minPasswordLength = game.settings?.auth?.minPasswordLength ?? 8;
    const zReqBody = z.object({
      email: z.email(),
      password: z.string().min(minPasswordLength),
      name: z.string().min(1),
    });
    const body = await parseJson(request, zReqBody);

    try {
      const {
        headers,
        response: { user: player },
      } = await createPlayerAuth(game).signUpEmail({
        body: {
          gameId: game.id,
          callbackURL: `/games/${game.id}/email-verified`,
          ...body,
        },
        returnHeaders: true,
      });

      const data = zResBody.parse({
        token: parseSessionToken(headers),
        player,
      });

      return created(data);
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
  '/api/v1/games/$gameId/auth/sign-up/email',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
