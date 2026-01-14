import { createPlayerAuth } from '@/libs/player-auth';
import { gameRepo } from '@/repos/game-repo';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const resetPassword = createServerFn({ method: HttpMethod.Post })
  .inputValidator(
    z.object({
      gameId: z.string(),
      newPassword: z.string(),
      token: z.string(),
    }),
  )
  .handler(async ({ data: { gameId, newPassword, token } }): Promise<void> => {
    const game = await gameRepo.findOneOrThrow({ where: { id: gameId } });
    const playerAuth = createPlayerAuth(game);
    await playerAuth.resetPassword({ body: { token, newPassword } });
  });
