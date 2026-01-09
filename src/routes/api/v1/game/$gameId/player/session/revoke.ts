import { parseJson, withGameAccess } from '@/domain/api';
import { playerSessionStore } from '@/stores/player-session-store';
import { noContent, notFound } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({
  token: z.string().min(32),
});

export async function DELETE({
  params: { gameId: gamePublicId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return withGameAccess({ gamePublicId, request }, async () => {
    const { token } = await parseJson(request, zReqBody);

    const sessions = await playerSessionStore.findMany({
      where: { token },
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
  '/api/v1/game/$gameId/player/session/revoke',
)({
  server: {
    handlers: {
      DELETE,
    },
  },
});
