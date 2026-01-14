import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyRepo } from '@/repos/game-api-key-repo';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const getGameApiKeys = createServerFn()
  .inputValidator(z.object({ gameId: z.string() }))
  .handler(async ({ data: { gameId } }) => {
    const user = await getUser();
    return gameApiKeyRepo.findManyForUserAndGame(user.id, gameId);
  });
