import { PlayersTable } from '@/components/app/game/players/players-table';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getPlayers } from '@/functions/game/players/get-players';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/games/$gameId/players/')(
  {
    loader: async ({ params: { gameId } }) => {
      const { game, players } = await getPlayers({
        data: { gameId },
      });
      return { game, players };
    },
    head: ({ loaderData }) => ({
      meta: seo({
        title: `Players | ${loaderData?.game.name} | ${env.VITE_APP_NAME}`,
      }),
    }),
    component: Players,
  },
);

function Players() {
  const { game, players } = Route.useLoaderData();

  return (
    <div>
      <Title order={2}>Players ({players.length})</Title>
      <PlayersTable game={game} players={players} />
    </div>
  );
}
