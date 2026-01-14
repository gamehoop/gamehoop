import { gameRepo } from '@/repos/game-repo';
import { playerRepo } from '@/repos/player-repo';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const deletePlayer = createServerFn({ method: HttpMethod.Post })
  .inputValidator(z.object({ gameId: z.string(), playerId: z.string() }))
  .handler(async ({ data: { gameId, playerId } }): Promise<void> => {
    const user = await getUser();
    const game = await gameRepo.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    await playerRepo.delete({ where: { id: playerId } });
  });
