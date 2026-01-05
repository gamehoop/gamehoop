import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const getGameApiKeys = createServerFn()
  .inputValidator(z.object({ gameId: z.int() }))
  .handler(async ({ data: { gameId } }) => {
    const user = await getUser();
    return gameApiKeyStore.findForGameAndUser(gameId, user.id);
  });
