import { createPlayerAuth } from '@/lib/player-auth';
import { gameStore } from '@/stores/game-store';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/api/player-auth/$gameId/$')({
  server: {
    handlers: {
      GET: async ({ params: { gameId }, request }) => {
        const game = await gameStore.findOne({ where: { id: gameId } });
        if (!game) {
          throw notFound();
        }
        const playerAuth = createPlayerAuth(game);
        return playerAuth.handler(request);
      },
      POST: async ({ params: { gameId }, request }) => {
        const game = await gameStore.findOne({ where: { id: gameId } });
        if (!game) {
          throw notFound();
        }
        const playerAuth = createPlayerAuth(game);
        return playerAuth.handler(request);
      },
    },
  },
});
