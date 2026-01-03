import { getSessionContext } from '@/functions/auth/get-session-context';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const getGameApiKeys = createServerFn()
  .inputValidator(z.object({ gameId: z.int() }))
  .handler(async ({ data: { gameId } }) => {
    const {
      activeOrganization: { games },
    } = await getSessionContext();

    const hasAccess = games.some((game) => game.id === gameId);
    if (!hasAccess) {
      throw new Error('Unauthorized');
    }

    return gameApiKeyStore.getByGameId(gameId);
  });
