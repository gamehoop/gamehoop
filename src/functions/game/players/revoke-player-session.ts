import { gameRepo } from '@/repos/game-repo';
import { playerRepo } from '@/repos/player-repo';
import { playerSessionRepo } from '@/repos/player-session-repo';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const revokePlayerSession = createServerFn({ method: HttpMethod.Post })
  .inputValidator(
    z.object({
      gameId: z.string(),
      playerId: z.string(),
      sessionId: z.string(),
    }),
  )
  .handler(async ({ data: { gameId, playerId, sessionId } }): Promise<void> => {
    const user = await getUser();
    const game = await gameRepo.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    const player = await playerRepo.findOne({
      where: { id: playerId },
    });

    if (!player || player.gameId !== game.id) {
      throw notFound();
    }

    await playerSessionRepo.delete({ where: { id: sessionId } });
  });
