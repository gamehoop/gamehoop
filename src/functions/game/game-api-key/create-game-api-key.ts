import { GameApiKey } from '@/db/types';
import { generateApiKey, hashApiKey } from '@/domain/game-api-key';
import { getUser } from '@/functions/auth/get-user';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { gameStore } from '@/stores/game-store';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const createGameApiKey = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      gameId: z.int(),
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
      const game = await gameStore.getByIdForUser(gameId, user.id);
      if (!game) {
        throw notFound();
      }

      const apiKey = generateApiKey();
      const keyHash = hashApiKey(apiKey);

      const gameApiKey = await gameApiKeyStore.create({
        gameId,
        keyHash,
        scopes,
        description,
        expiresAt,
        createdBy: user.id,
      });

      return { ...gameApiKey, apiKey };
    },
  );
