import { Game } from '@/db/types';
import { gameStore } from '@/stores/game-store';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../auth/get-user';

export const getGame = createServerFn()
  .inputValidator(z.object({ gameId: z.string() }))
  .handler(async ({ data: { gameId } }): Promise<Game | undefined> => {
    const user = await getUser();
    return gameStore.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
  });
