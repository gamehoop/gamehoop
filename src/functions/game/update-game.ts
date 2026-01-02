import { Game } from '@/db/types';
import { gameStore } from '@/stores/game-store';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getSessionContext } from '../auth/get-session-context';

export const updateGame = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameId: z.int(),
      name: z.string().optional(),
      genre: z.string().optional(),
      platforms: z.array(z.string()).optional(),
      sdk: z.string().optional(),
    }),
  )
  .handler(async ({ data: { gameId, ...values } }): Promise<Game> => {
    const {
      user,
      activeOrganization: { games },
    } = await getSessionContext();

    const hasAccess = games.some((game) => game.id === gameId);
    if (!hasAccess) {
      throw new Error('Unauthorized');
    }

    const game = await gameStore.update(gameId, {
      ...values,
      updatedBy: user.id,
    });

    return game;
  });
