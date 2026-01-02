import { buildKey, deleteObject } from '@/lib/s3';
import { gameStore } from '@/stores/game-store';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getSessionContext } from '../auth/get-session-context';

export const deleteGameLogo = createServerFn()
  .inputValidator(
    z.object({
      gameId: z.int(),
    }),
  )
  .handler(async ({ data: { gameId } }): Promise<void> => {
    const {
      activeOrganization: { games, id: organizationId },
    } = await getSessionContext();

    const hasAccess = games.some((game) => game.id === gameId);
    if (!hasAccess) {
      throw new Error('Unauthorized');
    }

    const key = buildKey(
      `organizations/${organizationId}/games/${gameId}/logo`,
    );
    await deleteObject(key);
    await gameStore.update(gameId, {
      logo: null,
    });
  });
