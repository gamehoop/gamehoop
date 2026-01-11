import { buildKey, deleteObject } from '@/lib/s3';
import { gameStore } from '@/stores/game-store';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const deleteGameLogo = createServerFn({ method: HttpMethod.Post })
  .inputValidator(
    z.object({
      gameId: z.int(),
    }),
  )
  .handler(async ({ data: { gameId } }): Promise<void> => {
    const user = await getUser();
    const game = await gameStore.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    const key = buildKey(
      `organizations/${game.organizationId}/game/${gameId}/logo`,
    );
    await deleteObject(key);
    await gameStore.updateOne({
      where: { id: gameId },
      data: {
        logo: null,
      },
    });
  });
