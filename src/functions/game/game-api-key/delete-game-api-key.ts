import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const deleteGameApiKey = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameApiKeyId: z.int(),
    }),
  )
  .handler(async ({ data: { gameApiKeyId } }): Promise<void> => {
    const user = await getUser();
    const gameApiKey = await gameApiKeyStore.getByIdForUser(
      gameApiKeyId,
      user.id,
    );
    if (!gameApiKey) {
      throw notFound();
    }

    await gameApiKeyStore.deleteById(gameApiKeyId);
  });
