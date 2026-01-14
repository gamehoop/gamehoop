import { createPlayerAuth } from '@/lib/player-auth';
import { gameStore } from '@/stores/game-store';
import { createFileRoute, notFound } from '@tanstack/react-router';

async function playerAuthRequestHandler({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  const game = await gameStore.findOne({ where: { id: gameId } });
  if (!game) {
    throw notFound();
  }
  const playerAuth = createPlayerAuth(game);
  return playerAuth.handler(request);
}

export const Route = createFileRoute('/api/player-auth/$gameId/$')({
  server: {
    handlers: {
      GET: playerAuthRequestHandler,
      POST: playerAuthRequestHandler,
    },
  },
});
