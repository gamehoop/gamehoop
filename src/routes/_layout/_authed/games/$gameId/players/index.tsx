import { PlayersTable } from '@/components/app/game/players/players-table';
import { DatePickerInput } from '@/components/ui/date-picker-input';
import { TextInput } from '@/components/ui/text-input';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getPlayers } from '@/functions/game/players/get-players';
import { seo } from '@/utils/seo';
import { DatesRangeValue } from '@mantine/dates';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, Search } from 'lucide-react';
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
  const [dateRange, setDateRange] = useState<DatesRangeValue<string>>();

  return (
    <div>
      <div className="flex justify-between">
        <Title order={2}>Players ({players.length})</Title>
        <div className="flex gap-2">
          <TextInput
            name="playerSearch"
            value={playerSearchString}
            onChange={(e) => setPlayerSearchString(e.target.value)}
            placeholder="Search players..."
            leftSection={<Search />}
            className="w-96"
          />
          <DatePickerInput
            type="range"
            clearable
            placeholder="Filter by creation date"
            leftSection={<Calendar />}
            name="dateFilter"
            value={dateRange}
            onChange={(value) => {
              const range = value as DatesRangeValue<string>;
              setDateRange(range);
            }}
            className="w-96"
          />
        </div>
      </div>
      <PlayersTable
        game={game}
        players={players}
        searchString={playerSearchString}
        dateRange={dateRange}
      />
    </div>
  );
}
