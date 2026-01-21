import { Avatar } from '@/components/ui/avatar';
import { Title } from '@/components/ui/title';
import { getPublicGameDetails } from '@/functions/game/get-public-game-details';
import { themeColor } from '@/styles/theme';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';
import { Gamepad2 } from 'lucide-react';

export const Route = createFileRoute(
  '/_auth/_player-auth/games/$gameId/email-verified',
)({
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
  const { game } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-2 items-center">
        <Avatar
          src={game.logo ? `/api/games/${game.id}/logo` : ''}
          size="lg"
          variant="light"
          color={themeColor}
        >
          <Gamepad2 />
        </Avatar>
        <Title order={2}>{game.name}</Title>
      </div>

      <div>Your email has been verified successfully. Enjoy playing!</div>
    </div>
  );
}
