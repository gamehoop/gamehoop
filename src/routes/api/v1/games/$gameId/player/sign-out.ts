import { playerApiHandler } from '@/domain/api';
import { playerSessionRepo } from '@/repos/player-session-repo';
import { noContent } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export async function DELETE({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ token }) => {
    await playerSessionRepo.delete({
      where: { token },
    });
    return noContent();
  });
}

export const Route = createFileRoute('/api/v1/games/$gameId/player/sign-out')({
  server: {
    handlers: {
      DELETE,
    },
  },
});
