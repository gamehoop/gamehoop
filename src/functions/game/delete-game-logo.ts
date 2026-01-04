import { buildKey, deleteObject } from '@/lib/s3';
import { gameStore } from '@/stores/game-store';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../auth/get-user';

export const deleteGameLogo = createServerFn()
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

    const key = buildKey(
      `organizations/${game.organizationId}/games/${gameId}/logo`,
    );
    await deleteObject(key);
    await gameStore.update(gameId, {
      logo: null,
    });
  });
