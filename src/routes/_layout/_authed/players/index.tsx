import { Title } from '@/components/ui/title';
import { getPlayers } from '@/functions/game/get-players';
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

    return { players };
  },
  component: Players,
});

function Players() {
  const { players } = Route.useLoaderData();

  return (
    <div>
      <Title order={2}>Players</Title>
      {JSON.stringify(players)}
    </div>
  );
}
