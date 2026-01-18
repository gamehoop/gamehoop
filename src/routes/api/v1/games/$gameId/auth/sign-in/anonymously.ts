import { Player } from '@/db/types';
import { gameApiHandler, parseJson, parseSessionToken } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { createPlayerAuth } from '@/libs/player-auth';
import { playerRepo } from '@/repos/player-repo';
import { playerSessionRepo } from '@/repos/player-session-repo';
import { created, notFound, serverError } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({
  playerId: z.string().optional(),
  name: z.string().min(1).optional(),
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
    const { playerId, name } = await parseJson(request, zReqBody);

    const { headers, response: session } = await createPlayerAuth(
      game,
    ).signInAnonymous({
      returnHeaders: true,
    });

    if (!session) {
      return serverError({
        error: 'Failed to create session for anonymous player',
      });
    }

    const { user: newPlayer } = session;

    let player: Player;
    if (playerId) {
      const existingPlayer = await playerRepo.findOne({
        where: { id: playerId },
      });
      if (!existingPlayer) {
        return notFound();
      }
      player = existingPlayer;

      await playerSessionRepo.update({
        where: { token: session.token },
        data: {
          userId: playerId,
        },
      });
      await playerRepo.delete({
        where: { id: newPlayer.id },
      });
    } else {
      player = await playerRepo.findOneOrThrow({
        where: { id: newPlayer.id },
      });
    }

    if (name && player.name !== name) {
      player = await playerRepo.updateOrThrow({
        where: { id: player.id },
        data: {
          name,
        },
      });
    }

    const data = zResBody.parse({
      token: parseSessionToken(headers),
      player,
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
