import { buildKey, deleteObject } from '@/libs/s3';
import { gameRepo } from '@/repos/game-repo';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const deleteGameLogo = createServerFn({ method: HttpMethod.Post })
  .inputValidator(
    z.object({
      gameId: z.string(),
    }),
  )
  .handler(async ({ data: { gameId } }): Promise<void> => {
    const user = await getUser();
    const game = await gameRepo.findOneForUser({
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
    await gameRepo.update({
      where: { id: gameId },
      data: {
        logo: null,
      },
    });
  });
