import { parseJson, withGameAccess } from '@/domain/api';
import { User } from '@/lib/auth';
import { createPlayerAuth } from '@/lib/player-auth';
import { playerSessionStore } from '@/stores/player-session-store';
import { playerStore } from '@/stores/player-store';
import { created, serverError } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({
  playerId: z.string().optional(),
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
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return withGameAccess({ gameId, request }, async ({ game }) => {
    const { playerId } = await parseJson(request, zReqBody);

    const session = await createPlayerAuth(game.id).api.signInAnonymous();
    if (!session) {
      return serverError({ error: 'Failed to create anonymous session' });
    }

    const { token, user } = session;

    let player: User;
    if (playerId) {
      player = await playerStore.findOneOrThrow({
        where: { id: playerId },
      });
      await playerSessionStore.updateMany({
        where: { token: session.token },
        data: {
          userId: playerId,
        },
      });
      await playerStore.deleteMany({
        where: { id: player.id },
      });
    } else {
      player = await playerStore.findOneOrThrow({
        where: { id: user.id },
      });
    }

    const data = zResBody.parse({
      token,
      player: {
        ...player,
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
      },
    });

    return created(data);
  });
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/auth/sign-in/anonymously',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
