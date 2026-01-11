import { gameStore } from '@/stores/game-store';
import { playerSessionStore } from '@/stores/player-session-store';
import { playerStore } from '@/stores/player-store';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const revokePlayerSession = createServerFn({ method: HttpMethod.Post })
  .inputValidator(
    z.object({
      gamePublicId: z.string(),
      playerId: z.string(),
      sessionId: z.string(),
    }),
  )
  .handler(
    async ({ data: { gamePublicId, playerId, sessionId } }): Promise<void> => {
      const user = await getUser();
      const game = await gameStore.findOneForUser({
        userId: user.id,
        where: { publicId: gamePublicId },
      });
      if (!game) {
        throw notFound();
      }

      const player = await playerStore.findOne({
        where: { id: playerId },
      });

      if (!player || player.gameId !== game.id) {
        throw notFound();
      }

      await playerSessionStore.deleteMany({ where: { id: sessionId } });
    },
  );
