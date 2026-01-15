import { getPublicGameDetails } from '@/functions/game/get-public-game-details';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_auth/_player-auth/games/$gameId/change-email-requested',
)({
  loader: async ({ params: { gameId } }) => {
    const game = await getPublicGameDetails({ data: { gameId } });
    return { game };
  },
  head: ({ loaderData }) => ({
    meta: seo({ title: `Change Email Requested | ${loaderData?.game.name}` }),
  }),
  component: PlayerChangeEmailRequested,
});

function PlayerChangeEmailRequested() {
  return (
    <div>Please check your new email address for a verification link.</div>
  );
}
