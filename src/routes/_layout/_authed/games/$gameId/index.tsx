import { GameConfiguration } from '@/components/app/game/game-configuration';
import { env } from '@/env/client';
import { getGameConfiguration } from '@/functions/game/get-game-configuration';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/games/$gameId/')({
  loader: async ({ params: { gameId } }) => {
    return getGameConfiguration({ data: { gameId } });
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `Configuration | ${loaderData?.game.name} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Game,
});

function Game() {
  const { game, gameApiKeys } = Route.useLoaderData();
  return <GameConfiguration game={game} gameApiKeys={gameApiKeys} />;
}
