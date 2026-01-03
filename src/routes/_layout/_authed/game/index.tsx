import { GameApiKeysTable } from '@/components/app/game/game-api-key/game-api-keys-table';
import { GameDangerZone } from '@/components/app/game/game-danger-zone';
import { GameSettingsForm } from '@/components/app/game/game-settings-form';
import { Divider } from '@/components/ui/divider';
import { Title } from '@/components/ui/title';
import { getGameApiKeys } from '@/functions/game/game-api-key/get-game-api-keys';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/game/')({
  loader: async ({
    context: {
      activeOrganization: { activeGame },
    },
  }) => {
    if (!activeGame) {
      throw redirect({ to: '/' });
    }

    const gameApiKeys = await getGameApiKeys({
      data: { gameId: activeGame.id },
    });

    return { activeGame, gameApiKeys };
  },
  component: Game,
});

function Game() {
  const { activeGame, gameApiKeys } = Route.useLoaderData();

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
      <GameApiKeysTable game={activeGame} gameApiKeys={gameApiKeys} />

      <Divider />

      <GameDangerZone game={activeGame} />
    </div>
  );
}
