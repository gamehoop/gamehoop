import { Game, Player } from '@/db/types';
import { playerRepo } from '@/repos/player-repo';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getGame } from '../get-game';

export const getPlayers = createServerFn()
  .inputValidator(z.object({ gameId: z.string() }))
  .handler(
    async ({
      data: { gameId },
    }): Promise<{ game: Game; players: Player[] }> => {
      const game = await getGame({ data: { gameId } });
      if (!game) {
        throw notFound();
      }

      const players = await playerRepo.findMany({
        where: { gameId: game.id },
      });

      return { game, players };
    },
  );
