import { Game } from '@/db/types';
import { gameStore } from '@/stores/game-store';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../auth/get-user';

export const updateGame = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameId: z.string(),
      name: z.string().optional(),
      genre: z.string().optional(),
      platforms: z.array(z.string()).optional(),
      sdk: z.string().optional(),
      settings: z
        .object({
          auth: z.object({
            requireEmailVerification: z.boolean().optional(),
            minPasswordLength: z.int().min(8).max(128).optional(),
            sessionExpiresInDays: z.int().min(1).optional(),
          }),
        })
        .optional(),
    }),
  )
  .handler(async ({ data: { gameId, ...values } }): Promise<Game> => {
    const user = await getUser();
    const game = await gameStore.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    return gameStore.updateOrThrow({
      where: { id: gameId },
      data: {
        ...values,
        updatedBy: user.id,
      },
    });
  });
