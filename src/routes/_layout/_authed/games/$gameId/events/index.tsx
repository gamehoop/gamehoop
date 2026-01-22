import { GameEventsTable } from '@/components/app/game/events/game-events-table';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getGameEvents } from '@/functions/game/events/get-game-events';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/games/$gameId/events/')({
  loader: async ({ params: { gameId } }) => {
    const { game, events } = await getGameEvents({
      data: { gameId },
    });
    return { game, events };
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `Events | ${loaderData?.game.name} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: GameEvents,
});

function GameEvents() {
  const { game, events } = Route.useLoaderData();

  return (
    <div>
      <Title order={2}>Events</Title>
      <GameEventsTable game={game} events={events} />
    </div>
  );
}
