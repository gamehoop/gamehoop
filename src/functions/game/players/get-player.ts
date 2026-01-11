import { Game, Player, PlayerSession } from '@/db/types';
import { playerSessionStore } from '@/stores/player-session-store';
import { playerStore } from '@/stores/player-store';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getGame } from '../get-game';

export const getPlayer = createServerFn()
  .inputValidator(z.object({ gamePublicId: z.string(), playerId: z.string() }))
  .handler(
    async ({
      data: { gamePublicId, playerId },
    }): Promise<{ game: Game; player: Player; sessions: PlayerSession[] }> => {
      const game = await getGame({ data: { gamePublicId } });
      if (!game) {
        throw notFound();
      }

      const player = await playerStore.findOne({
        where: { id: playerId },
      });

      if (!player || player.gameId !== game.id) {
        throw notFound();
      }

      const sessions = await playerSessionStore.findMany({
        where: { userId: player.id },
      });

      return { game, player, sessions };
    },
  );
