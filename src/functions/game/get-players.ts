import { Player } from '@/db/types';
import { gameStore } from '@/stores/game-store';
import { playerStore } from '@/stores/player-store';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../auth/get-user';

export const getPlayers = createServerFn()
  .inputValidator(z.object({ gameId: z.int() }))
  .handler(async ({ data: { gameId } }): Promise<Player[]> => {
    const user = await getUser();
    const game = await gameStore.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    const players = await playerStore.findMany({ where: { gameId } });

    return players;
  });
