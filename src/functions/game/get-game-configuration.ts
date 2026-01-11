import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { gameStore } from '@/stores/game-store';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const getGameConfiguration = createServerFn()
  .inputValidator(z.object({ gamePublicId: z.string() }))
  .handler(async ({ data: { gamePublicId } }) => {
    const user = await getUser();
    const [game, gameApiKeys] = await Promise.all([
      gameStore.findOneForUser({
        userId: user.id,
        where: { publicId: gamePublicId },
      }),
      gameApiKeyStore.findManyForUserAndGame(user.id, gamePublicId),
    ]);

    if (!game) {
      throw notFound();
    }

    return { game, gameApiKeys };
  });
