import { PlayersTable } from '@/components/app/game/players/players-table';
import { Title } from '@/components/ui/title';
import { getPlayers } from '@/functions/game/players/get-players';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/players/')({
  loader: async ({
    context: {
      activeOrganization: { activeGame },
    },
  }) => {
    if (!activeGame) {
      throw redirect({ to: '/' });
    }

    const players = await getPlayers({ data: { gameId: activeGame.id } });

    return { activeGame, players };
  },
  component: Players,
});

function Players() {
  const { players } = Route.useLoaderData();

  return (
    <div>
      <Title order={2}>Players ({players.length})</Title>
      <PlayersTable players={players} />
    </div>
  );
}
