import { GameDangerZone } from '@/components/app/game/game-danger-zone';
import { GameSettingsForm } from '@/components/app/game/game-settings-form';
import { Divider } from '@/components/ui/divider';
import { Title } from '@/components/ui/title';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/game/')({
  loader: ({
    context: {
      activeOrganization: { activeGame },
    },
  }) => {
    if (!activeGame) {
      throw redirect({ to: '/' });
    }

    return { activeGame };
  },
  component: Game,
});

function Game() {
  const { activeGame } = Route.useLoaderData();

  return (
    <div>
      <Title order={2}>{activeGame.name}</Title>
      <p className="text-sm pb-4">
        Created{' '}
        {activeGame.createdAt.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <GameSettingsForm game={activeGame} />

      <Divider />

      <GameDangerZone game={activeGame} />
    </div>
  );
}
