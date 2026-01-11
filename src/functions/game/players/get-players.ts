import { Game, Player } from '@/db/types';
import { playerStore } from '@/stores/player-store';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getGame } from '../get-game';

export const getPlayers = createServerFn()
  .inputValidator(z.object({ gamePublicId: z.string() }))
  .handler(
    async ({
      data: { gamePublicId },
    }): Promise<{ game: Game; players: Player[] }> => {
      const game = await getGame({ data: { gamePublicId } });
      if (!game) {
        throw notFound();
      }

      const players = await playerStore.findMany({
        where: { gameId: game.id },
      });

      return { game, players };
    },
  );
