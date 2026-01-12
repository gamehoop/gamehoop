import { parseJson, withPlayerAccess } from '@/domain/api';
import { playerSessionStore } from '@/stores/player-session-store';
import { noContent, notFound } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({
  token: z.string().min(32),
});

export async function DELETE({
  params: { gameId, playerId },
  request,
}: {
  params: { gameId: string; playerId: string };
  request: Request;
}) {
  return withPlayerAccess({ gameId, playerId, request }, async () => {
    const { token } = await parseJson(request, zReqBody);

    const sessions = await playerSessionStore.findMany({
      where: { token, userId: playerId },
    });
    if (!sessions.length) {
      return notFound();
    }

    await playerSessionStore.deleteMany({
      where: { token },
    });
    return noContent();
  });
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/players/$playerId/revoke-session',
)({
  server: {
    handlers: {
      DELETE,
    },
  },
});
