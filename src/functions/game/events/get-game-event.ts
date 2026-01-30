import { Game, GameEvent, Player } from '@/db/types';
import { gameEventRepo } from '@/repos/game-event-repo';
import { playerRepo } from '@/repos/player-repo';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getGame } from '../get-game';

export const getGameEvent = createServerFn()
  .inputValidator(z.object({ gameId: z.string(), eventId: z.string() }))
  .handler(
    async ({
      data: { gameId, eventId },
    }): Promise<{
      game: Game;
      player: Player | undefined;
      event: GameEvent;
    }> => {
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

      let player: Player | undefined = undefined;
      if (event.playerId) {
        player = await playerRepo.findOne({
          where: { id: event.playerId },
        });
      }

      return { game, player, event };
    },
  );
