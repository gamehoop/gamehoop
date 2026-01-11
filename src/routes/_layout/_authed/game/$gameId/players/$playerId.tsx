import { PlayerTable } from '@/components/app/game/players/player-table';
import { Title } from '@/components/ui/title';
import { getPlayer } from '@/functions/game/players/get-player';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/_authed/game/$gameId/players/$playerId',
)({
  loader: async ({ params: { gameId, playerId } }) => {
    return getPlayer({ data: { gamePublicId: gameId, playerId } });
  },
  component: Player,
});

function Player() {
  const { player } = Route.useLoaderData();
  return (
    <div>
      <Title order={2}>Player - {player.name}</Title>
      <PlayerTable player={player} />
    </div>
  );
}
