import { PlayersTable } from '@/components/app/game/players/players-table';
import { Title } from '@/components/ui/title';
import { getPlayers } from '@/functions/game/players/get-players';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/game/$gameId/players/')({
  loader: async ({ params: { gameId } }) => {
    const { game, players } = await getPlayers({
      data: { gamePublicId: gameId },
    });
    return { game, players };
  },
  component: Players,
});

function Players() {
  const { game, players } = Route.useLoaderData();

  return (
    <div>
      <Title order={2}>Players ({players.length})</Title>
      <PlayersTable game={game} players={players} />
    </div>
  );
}
