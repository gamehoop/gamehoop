import { db } from '@/db';
import { Player } from '@/db/types';
import { getSessionContext } from '@/functions/auth/get-session-context';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const getPlayers = createServerFn()
  .inputValidator(z.object({ gameId: z.int() }))
  .handler(async ({ data: { gameId } }): Promise<Player[]> => {
    const {
      activeOrganization: { games },
    } = await getSessionContext();

    const hasAccess = games.some((game) => game.id === gameId);
    if (!hasAccess) {
      throw new Error('Unauthorized');
    }

    const players = await db
      .selectFrom('player')
      .where('gameId', '=', gameId)
      .selectAll()
      .execute();

    return players;
  });
