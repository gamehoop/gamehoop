import { gameStore } from '@/stores/game-store';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../auth/get-user';

export const deleteGame = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameId: z.int(),
    }),
  )
  .handler(async ({ data: { gameId } }): Promise<void> => {
    const user = await getUser();
    const game = await gameStore.getByIdForUser(gameId, user.id);
    if (!game) {
      throw notFound();
    }

    await gameStore.deleteById(gameId);
  });
