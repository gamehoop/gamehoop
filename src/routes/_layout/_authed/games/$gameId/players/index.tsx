import { PlayersTable } from '@/components/app/game/players/players-table';
import { TextInput } from '@/components/ui/text-input';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getPlayers } from '@/functions/game/players/get-players';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useState } from 'react';

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
  const [playerSearchString, setPlayerSearchString] = useState('');

  return (
    <div>
      <div className="flex justify-between">
        <Title order={2}>Players ({players.length})</Title>
        <TextInput
          name="playerSearch"
          value={playerSearchString}
          onChange={(e) => setPlayerSearchString(e.target.value)}
          placeholder="Search players..."
          leftSection={<Search />}
          size="sm"
          className="w-96"
        />
      </div>
      <PlayersTable
        game={game}
        players={players}
        searchString={playerSearchString}
      />
    </div>
  );
}
