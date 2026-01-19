import { useDeletePlayerModal } from '@/components/app/game/players/delete-player-modal';
import { PlayerTable } from '@/components/app/game/players/player-table';
import { PlayerSessionsTable } from '@/components/app/game/players/sessions/player-sessions-table';
import { useUpdatePlayerModal } from '@/components/app/game/players/use-update-player-modal';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getPlayer } from '@/functions/game/players/get-player';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';
import { Pencil, Trash2 } from 'lucide-react';

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
  const showUpdatePlayerModal = useUpdatePlayerModal({ game, player });
  const showDeletePlayerModal = useDeletePlayerModal();

  return (
    <>
      <div className="flex justify-between">
        <Title order={2}>Player - {player.name}</Title>

        <div className="flex gap-2">
          <Button
            onClick={showUpdatePlayerModal}
            size="sm"
            leftSection={<Pencil />}
            variant="default"
          >
            Edit
          </Button>

          <Button
            onClick={() => showDeletePlayerModal(player)}
            destructive
            size="sm"
            leftSection={<Trash2 />}
          >
            Delete
          </Button>
        </div>
      </div>
      <PlayerTable player={player} />

      <Title order={4} className="pt-4">
        Sessions ({sessions.length})
      </Title>
      <PlayerSessionsTable game={game} player={player} sessions={sessions} />
    </>
  );
}
