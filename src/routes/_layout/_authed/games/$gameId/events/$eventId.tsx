import { GameEventTable } from '@/components/app/game/events/game-event-table';
import { useDeleteGameEventModal } from '@/components/app/game/events/use-delete-game-event-modal';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getGameEvent } from '@/functions/game/events/get-game-event';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';

export const Route = createFileRoute(
  '/_layout/_authed/games/$gameId/events/$eventId',
)({
  loader: async ({ params: { gameId, eventId } }) => {
    return getGameEvent({ data: { gameId, eventId } });
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `Events | ${loaderData?.game.name} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Event,
});

function Event() {
  const { event, player } = Route.useLoaderData();
  const showDeleteGameEventModal = useDeleteGameEventModal();

  return (
    <div>
      <div className="flex justify-between">
        <Title order={2}>Event - {event.name}</Title>
        <Button
          onClick={() => showDeleteGameEventModal(event)}
          destructive
          size="sm"
          leftSection={<Trash2 />}
        >
          Delete
        </Button>
      </div>

      <GameEventTable player={player} event={event} />
    </div>
  );
}
