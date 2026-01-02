import { gameStore } from '@/stores/game-store';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getSessionContext } from '../auth/get-session-context';

export const deleteGame = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameId: z.int(),
    }),
  )
  .handler(async ({ data: { gameId } }): Promise<void> => {
    const {
      activeOrganization: { games },
    } = await getSessionContext();

    const hasAccess = games.some((game) => game.id === gameId);
    if (!hasAccess) {
      throw new Error('Unauthorized');
    }

    await gameStore.deleteById(gameId);
  });
