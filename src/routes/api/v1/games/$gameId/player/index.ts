import { playerApiHandler } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export async function GET({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ player }) => {
    const data = zPlayer.parse({
      ...player,
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
    });
    return ok(data);
  });
}

export const Route = createFileRoute('/api/v1/games/$gameId/player/')({
  server: {
    handlers: {
      GET,
    },
  },
});
