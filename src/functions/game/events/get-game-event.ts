import { Game, GameEvent } from '@/db/types';
import { gameEventRepo } from '@/repos/game-event-repo';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getGame } from '../get-game';

export const getGameEvent = createServerFn()
  .inputValidator(z.object({ gameId: z.string(), eventId: z.string() }))
  .handler(
    async ({
      data: { gameId, eventId },
    }): Promise<{ game: Game; event: GameEvent }> => {
      const game = await getGame({ data: { gameId } });
      if (!game) {
        throw notFound();
      }

      const event = await gameEventRepo.findOne({
        where: { gameId, id: eventId },
      });
      if (!event) {
        throw notFound();
      }

      return { game, event };
    },
  );
