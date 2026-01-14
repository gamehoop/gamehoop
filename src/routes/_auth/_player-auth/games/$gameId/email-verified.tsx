import { getPublicGameDetails } from '@/functions/game/get-public-game-details';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute(
  '/_auth/_player-auth/games/$gameId/email-verified',
)({
  validateSearch: z.object({
    email: z.string(),
  }),
  loader: async ({ params: { gameId } }) => {
    const game = await getPublicGameDetails({ data: { gameId } });
    return { game };
  },
  head: ({ loaderData }) => ({
    meta: seo({ title: `Email Verified | ${loaderData?.game.name}` }),
  }),
  component: PlayerEmailVerified,
});

function PlayerEmailVerified() {
  const { email } = Route.useSearch();
  return (
    <div>
      Your email <strong>{email}</strong> has been verified successfully. Enjoy
      playing!
    </div>
  );
}
