import { createPlayerAuth } from '@/lib/player-auth';
import { gameStore } from '@/stores/game-store';
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
    const game = await gameStore.findOneOrThrow({ where: { id: gameId } });
    const playerAuth = createPlayerAuth(game);
    await playerAuth.resetPassword({ body: { token, newPassword } });
  });
