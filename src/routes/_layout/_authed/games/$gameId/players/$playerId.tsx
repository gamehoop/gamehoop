import { PlayerTable } from '@/components/app/game/players/player-table';
import { PlayerSessionsTable } from '@/components/app/game/players/sessions/player-sessions-table';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getPlayer } from '@/functions/game/players/get-player';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/_authed/games/$gameId/players/$playerId',
)({
  loader: async ({ params: { gameId, playerId } }) => {
    return getPlayer({ data: { gameId, playerId } });
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.player.name} | ${loaderData?.game.name} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Player,
});

function Player() {
  const { game, player, sessions } = Route.useLoaderData();
  return (
    <div>
      <Title order={2}>Player - {player.name}</Title>
      <PlayerTable player={player} />

      <Title order={4} className="pt-4">
        Sessions ({sessions.length})
      </Title>
      <PlayerSessionsTable game={game} player={player} sessions={sessions} />
    </div>
  );
}
