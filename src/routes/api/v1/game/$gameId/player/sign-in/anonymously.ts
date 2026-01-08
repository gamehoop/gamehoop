import { parseJson, withGameAccess } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { playerSessionStore } from '@/stores/player-session-store';
import { playerStore } from '@/stores/player-store';
import { created, serverError } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export async function POST({
  params: { gameId: gamePublicId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return withGameAccess({ gamePublicId, request }, async ({ game }) => {
    const { playerId } = await parseJson(
      request,
      z.object({
        playerId: z.string().optional(),
      }),
    );

    const session = await createPlayerAuth(game.id).api.signInAnonymous();
    if (!session) {
      return serverError({ error: 'Failed to create anonymous session' });
    }

    const { token, user: player } = session;
    let email = player.email;

    if (playerId) {
      const existingPlayer = await playerStore.findOneOrThrow({
        where: { id: playerId },
      });
      email = existingPlayer.email;

      await playerSessionStore.updateMany({
        where: { token: session.token },
        data: {
          userId: playerId,
        },
      });

      await playerStore.deleteMany({
        where: { id: player.id },
      });
    }

    const data = {
      token,
      player: {
        ...player,
        id: playerId ?? player.id,
        email,
      },
    };

    return created(data);
  });
}

export const Route = createFileRoute(
  '/api/v1/game/$gameId/player/sign-in/anonymously',
)({
  server: {
    handlers: {
      POST,
    },
  },
});
