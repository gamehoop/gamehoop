import { gameApiHandler, parseJson, parseSessionToken } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { logError } from '@/libs/logger';
import { createPlayerAuth } from '@/libs/player-auth';
import { created, unauthorized } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import { APIError } from 'better-auth';
import z from 'zod';

const zReqBody = z.object({
  email: z.email(),
  password: z.string().min(1),
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
      const {
        headers,
        response: { user: player },
      } = await createPlayerAuth(game).signInEmail({
        body,
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
