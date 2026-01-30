import { GameEventTable } from '@/components/app/game/events/game-event-table';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getGameEvent } from '@/functions/game/events/get-game-event';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

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

  return (
    <div>
      <Title order={2}>Event - {event.name}</Title>
      <GameEventTable player={player} event={event} />
    </div>
  );
}
