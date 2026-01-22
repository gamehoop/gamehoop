import { Game, GameEvent } from '@/db/types';
import { gameEventRepo } from '@/repos/game-event-repo';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getGame } from '../get-game';

export const getGameEvents = createServerFn()
  .inputValidator(z.object({ gameId: z.string() }))
  .handler(
    async ({
      data: { gameId },
    }): Promise<{ game: Game; events: GameEvent[] }> => {
      const game = await getGame({ data: { gameId } });
      if (!game) {
        throw notFound();
      }

      const events = await gameEventRepo.findMany({
        where: { gameId },
        orderBy: { timestamp: 'desc' },
      });

      return { game, events };
    },
  );
