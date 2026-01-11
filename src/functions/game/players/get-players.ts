import { Game, Player } from '@/db/types';
import { gameStore } from '@/stores/game-store';
import { playerStore } from '@/stores/player-store';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const getPlayers = createServerFn()
  .inputValidator(z.object({ gamePublicId: z.string() }))
  .handler(
    async ({
      data: { gamePublicId },
    }): Promise<{ game: Game; players: Player[] }> => {
      const user = await getUser();
      const game = await gameStore.findOneForUser({
        userId: user.id,
        where: { publicId: gamePublicId },
      });
      if (!game) {
        throw notFound();
      }

      const players = await playerStore.findMany({
        where: { gameId: game.id },
      });

      return { game, players };
    },
  );
