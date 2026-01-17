import { createPlayerAuth } from '@/libs/player-auth';
import { gameRepo } from '@/repos/game-repo';
import { createFileRoute, notFound } from '@tanstack/react-router';

async function playerAuthRequestHandler({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  const game = await gameRepo.findOne({ where: { id: gameId } });
  if (!game) {
    throw notFound();
  }
  return createPlayerAuth(game).handler(request);
}

export const Route = createFileRoute('/api/player-auth/$gameId/$')({
  server: {
    handlers: {
      GET: playerAuthRequestHandler,
      POST: playerAuthRequestHandler,
    },
  },
});
