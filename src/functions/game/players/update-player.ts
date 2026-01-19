import { Player } from '@/db/types';
import { playerRepo } from '@/repos/player-repo';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getPlayer } from './get-player';

export const updatePlayer = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameId: z.string(),
      playerId: z.string(),
      name: z.string().min(1),
    }),
  )
  .handler(
    async ({ data: { gameId, playerId, ...values } }): Promise<Player> => {
      const { player } = await getPlayer({ data: { gameId, playerId } });
      return playerRepo.updateOrThrow({
        where: { id: player.id },
        data: {
          ...values,
        },
      });
    },
  );
