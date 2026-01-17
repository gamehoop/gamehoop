import { adminPlayerApiHandler } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export async function GET({
  params: { gameId, playerId },
  request,
}: {
  params: { gameId: string; playerId: string };
  request: Request;
}) {
  return adminPlayerApiHandler(
    { gameId, playerId, request },
    async ({ player }) => {
      const data = zPlayer.parse(player);
      return ok(data);
    },
  );
}

export const Route = createFileRoute(
  '/api/v1/admin/games/$gameId/players/$playerId/',
)({
  server: {
    handlers: {
      GET,
    },
  },
});
