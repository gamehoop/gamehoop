import { Divider } from '@/components/ui/divider';
import { Title } from '@/components/ui/title';
import { Game, GameApiKey } from '@/db/types';
import { GameApiKeysTable } from './game-api-key/game-api-keys-table';
import { GameDangerZone } from './game-danger-zone';
import { GameSettingsForm } from './game-settings-form';

export interface GameConfigurationProps {
  game: Game;
  gameApiKeys: GameApiKey[];
}

export function GameConfiguration({
  game,
  gameApiKeys,
}: GameConfigurationProps) {
  return (
    <div>
      <Title order={2}>{game.name}</Title>
      <p className="text-sm pb-4">
        Created{' '}
        {game.createdAt.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <GameSettingsForm game={game} />

      <Divider />
      <GameApiKeysTable game={game} gameApiKeys={gameApiKeys} />

      <Divider />

      <GameDangerZone game={game} />
    </div>
  );
}
