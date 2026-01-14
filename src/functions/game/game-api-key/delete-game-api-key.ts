import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyRepo } from '@/repos/game-api-key-repo';
import { gameRepo } from '@/repos/game-repo';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const deleteGameApiKey = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameApiKeyId: z.string(),
      gameId: z.string(),
    }),
  )
  .handler(async ({ data: { gameApiKeyId, gameId } }): Promise<void> => {
    const user = await getUser();
    const game = await gameRepo.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    await gameApiKeyRepo.delete({ where: { id: gameApiKeyId, gameId } });
  });
