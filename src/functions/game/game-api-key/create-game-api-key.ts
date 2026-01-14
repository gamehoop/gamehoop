import { GameApiKey } from '@/db/types';
import { generateApiKey, hashApiKey } from '@/domain/game-api-key';
import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyRepo } from '@/repos/game-api-key-repo';
import { gameRepo } from '@/repos/game-repo';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const createGameApiKey = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameId: z.string(),
      scopes: z.array(z.string()),
      expiresAt: z
        .string()
        .optional()
        .refine(
          (val) => {
            return !val || new Date(val) > new Date();
          },
          { error: 'Cannot expire in the past' },
        )
        .transform((val) => (val ? new Date(val) : null)),
      description: z.string().optional(),
    }),
  )
  .handler(
    async ({
      data: { gameId, scopes, expiresAt, description },
    }): Promise<GameApiKey & { apiKey: string }> => {
      const user = await getUser();
      const game = await gameRepo.findOneForUser({
        userId: user.id,
        where: { id: gameId },
      });
      if (!game) {
        throw notFound();
      }

      const apiKey = generateApiKey();
      const keyHash = hashApiKey(apiKey);

      const gameApiKey = await gameApiKeyRepo.create({
        gameId: game.id,
        keyHash,
        scopes,
        description,
        expiresAt,
        createdBy: user.id,
      });

      return { ...gameApiKey, apiKey };
    },
  );
