import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { gameStore } from '@/stores/game-store';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const getGameConfiguration = createServerFn()
  .inputValidator(z.object({ gameId: z.string() }))
  .handler(async ({ data: { gameId } }) => {
    const user = await getUser();
    const [game, gameApiKeys] = await Promise.all([
      gameStore.findOneForUser({
        userId: user.id,
        where: { id: gameId },
      }),
      gameApiKeyStore.findManyForUserAndGame(user.id, gameId),
    ]);

    if (!game) {
      throw notFound();
    }

    return { game, gameApiKeys };
  });
