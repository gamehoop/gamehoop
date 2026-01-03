import { GameApiKey } from '@/db/types';
import { getSessionContext } from '@/functions/auth/get-session-context';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import crypto from 'crypto';
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
      const {
        user,
        activeOrganization: { games },
      } = await getSessionContext();

      const hasAccess = games.some((game) => game.id === gameId);
      if (!hasAccess) {
        throw new Error('Unauthorized');
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

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}
