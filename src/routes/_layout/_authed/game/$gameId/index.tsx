import { GameConfiguration } from '@/components/app/game/game-configuration';
import { getGameConfiguration } from '@/functions/game/get-game-configuration';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/game/$gameId/')({
  loader: async ({ params: { gameId } }) => {
    return getGameConfiguration({ data: { gamePublicId: gameId } });
  },
  component: Game,
});

function Game() {
  const { game, gameApiKeys } = Route.useLoaderData();
  return <GameConfiguration game={game} gameApiKeys={gameApiKeys} />;
}
