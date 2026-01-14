import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyRepo } from '@/repos/game-api-key-repo';
import { gameRepo } from '@/repos/game-repo';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const getGameConfiguration = createServerFn()
  .inputValidator(z.object({ gameId: z.string() }))
  .handler(async ({ data: { gameId } }) => {
    const user = await getUser();
    const [game, gameApiKeys] = await Promise.all([
      gameRepo.findOneForUser({
        userId: user.id,
        where: { id: gameId },
      }),
      gameApiKeyRepo.findManyForUserAndGame(user.id, gameId),
    ]);

    if (!game) {
      throw notFound();
    }

    return { game, gameApiKeys };
  });
