import { gameStore } from '@/stores/game-store';
import { playerStore } from '@/stores/player-store';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const deletePlayer = createServerFn({ method: HttpMethod.Post })
  .inputValidator(z.object({ gameId: z.string(), playerId: z.string() }))
  .handler(async ({ data: { gameId, playerId } }): Promise<void> => {
    const user = await getUser();
    const game = await gameStore.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    await playerStore.deleteMany({ where: { id: playerId } });
  });
