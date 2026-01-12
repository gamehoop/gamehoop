import { gameApiHandler, parseJson } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
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
    const { playerId } = await parseJson(request, zReqBody);

    const playerAuth = createPlayerAuth(game.id);
    const session = await playerAuth.signInAnonymous();
    if (!session) {
      return serverError({
        error: 'Failed to create session for anonymous player',
      });
    }

    const { token, user } = session;

    let player: User;
    if (playerId) {
      player = await playerStore.findOneOrThrow({
        where: { id: playerId },
      });
      await playerSessionStore.update({
        where: { token: session.token },
        data: {
          userId: playerId,
        },
      });
      await playerStore.delete({
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
