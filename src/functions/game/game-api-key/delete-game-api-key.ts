import { getSessionContext } from '@/functions/auth/get-session-context';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { HttpMethod } from '@/utils/http';
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
    const {
      activeOrganization: { games },
    } = await getSessionContext();

    const gameApiKey = await gameApiKeyStore.getById(gameApiKeyId);

    const hasAccess = games.some((game) => game.id === gameApiKey.gameId);
    if (!hasAccess) {
      throw new Error('Unauthorized');
    }

    await gameApiKeyStore.deleteById(gameApiKeyId);
  });
