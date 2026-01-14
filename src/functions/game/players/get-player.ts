import { Game, Player, PlayerSession } from '@/db/types';
import { playerRepo } from '@/repos/player-repo';
import { playerSessionRepo } from '@/repos/player-session-repo';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getGame } from '../get-game';

export const getPlayer = createServerFn()
  .inputValidator(z.object({ gameId: z.string(), playerId: z.string() }))
  .handler(
    async ({
      data: { gameId, playerId },
    }): Promise<{ game: Game; player: Player; sessions: PlayerSession[] }> => {
      const game = await getGame({ data: { gameId } });
      if (!game) {
        throw notFound();
      }

      const player = await playerRepo.findOne({
        where: { id: playerId },
      });

      if (!player || player.gameId !== game.id) {
        throw notFound();
      }

      const sessions = await playerSessionRepo.findMany({
        where: { userId: player.id },
      });

      return { game, player, sessions };
    },
  );
