import { gameApiHandler, parseJson } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { User } from '@/libs/auth';
import { createPlayerAuth } from '@/libs/player-auth';
import { playerRepo } from '@/repos/player-repo';
import { playerSessionRepo } from '@/repos/player-session-repo';
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

    const playerAuth = createPlayerAuth(game);
    const { headers, response: session } = await playerAuth.signInAnonymous({
      returnHeaders: true,
    });

    if (!session) {
      return serverError({
        error: 'Failed to create session for anonymous player',
      });
    }

    const { token, user } = session;

    let player: User;
    if (playerId) {
      player = await playerRepo.findOneOrThrow({
        where: { id: playerId },
      });
      await playerSessionRepo.update({
        where: { token: session.token },
        data: {
          userId: playerId,
        },
      });
      await playerRepo.delete({
        where: { id: player.id },
      });
    } else {
      player = await playerRepo.findOneOrThrow({
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

    return created(data, { headers });
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
