import { Game, Player } from '@/db/types';
import { gameStore } from '@/stores/game-store';
import { playerStore } from '@/stores/player-store';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const getPlayer = createServerFn()
  .inputValidator(z.object({ gamePublicId: z.string(), playerId: z.string() }))
  .handler(
    async ({
      data: { gamePublicId, playerId },
    }): Promise<{ game: Game; player: Player }> => {
      const user = await getUser();
      const game = await gameStore.findOneForUser({
        userId: user.id,
        where: { publicId: gamePublicId },
      });
      if (!game) {
        throw notFound();
      }

      const player = await playerStore.findOne({
        where: { id: playerId },
      });

      if (!player || player.gameId !== game.id) {
        throw notFound();
      }

      return { game, player };
    },
  );
