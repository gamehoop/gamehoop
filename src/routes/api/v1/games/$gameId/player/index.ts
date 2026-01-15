import { playerApiHandler } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { playerRepo } from '@/repos/player-repo';
import { noContent, ok } from '@/utils/http';
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

export async function DELETE({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ player }) => {
    await playerRepo.delete({ where: { id: player.id } });
    return noContent();
  });
}

export const Route = createFileRoute('/api/v1/games/$gameId/player/')({
  server: {
    handlers: {
      GET,
      DELETE,
    },
  },
});
