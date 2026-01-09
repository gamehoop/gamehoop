import { parseJson, withGameAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { created } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const zResBody = z.object({
  token: z.string(),
  player: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
    gameId: z.string(),
    image: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export function POST({
  params: { gameId: gamePublicId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}): Promise<Response> {
  return withGameAccess({ gamePublicId, request }, async ({ game }) => {
    const body = await parseJson(request, zReqBody);

    const { token, user: player } = await createPlayerAuth(
      game.id,
    ).api.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '/player-verified',
        ...body,
      },
    });

    const data = zResBody.parse({
      token,
      player: {
        ...player,
        gameId: game.publicId,
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
      },
    });

    return created(data);
  });
}

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/sign-up/email',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
