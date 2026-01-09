import { parseJson, withGameAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { created, unauthorized } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({
  email: z.email(),
  password: z.string().min(8),
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

export async function POST({
  params: { gameId: gamePublicId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return withGameAccess({ gamePublicId, request }, async ({ game }) => {
    const body = await parseJson(request, zReqBody);

    try {
      const { token, user: player } = await createPlayerAuth(
        game.id,
      ).api.signInEmail({ body });

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
