import { Game, Player } from '@/db/types';
import { logError } from '@/lib/logger';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { gameStore } from '@/stores/game-store';
import { playerStore } from '@/stores/player-store';
import {
  badRequest,
  forbidden,
  notFound,
  serverError,
  unauthorized,
} from '@/utils/http';
import z from 'zod';
import { hashApiKey } from './game-api-key';

export async function verifyApiToken(
  request: Request,
  { gamePublicId }: { gamePublicId: string },
) {
  const token = getBearerToken(request);
  if (!token) {
    throw unauthorized({ error: 'Unauthorized' });
  }

  const apiKeys = await gameApiKeyStore.findForGame(gamePublicId);
  const apiKey = apiKeys.find(
    ({ active, keyHash }) => active && keyHash === hashApiKey(token),
  );
  if (!apiKey) {
    throw forbidden({ error: 'Forbidden' });
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    throw forbidden({ error: 'Expired API key' });
  }
}

export function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get('Authorization');
  if (!authorization) {
    return null;
  }

  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer') {
    return null;
  }

  return token ?? null;
}

export async function parseJson<S extends z.ZodObject>(
  request: Request,
  schema: S,
): Promise<z.infer<S>> {
  try {
    return schema.parse(await request.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError(message);
    throw badRequest({ error: message });
  }
}

export async function withGameAccess(
  { request, gamePublicId }: { request: Request; gamePublicId: string },
  handler: ({ game }: { game: Game }) => Promise<Response>,
) {
  try {
    await verifyApiToken(request, { gamePublicId });

    const game = await gameStore.findOne({ where: { publicId: gamePublicId } });
    if (!game) {
      throw notFound();
    }

    return await handler({ game });
  } catch (error) {
    logError(error);
    if (error instanceof Response) {
      return error;
    }
    return serverError();
  }
}

export async function withPlayerAccess(
  {
    request,
    gamePublicId,
    playerId,
  }: { request: Request; gamePublicId: string; playerId: string },
  handler: ({
    game,
    player,
  }: {
    game: Game;
    player: Player;
  }) => Promise<Response>,
) {
  return withGameAccess({ gamePublicId, request }, async ({ game }) => {
    const player = await playerStore.findOne({
      where: { id: playerId, gameId: game.id },
    });

    if (!player) {
      throw notFound();
    }

    return handler({ game, player });
  });
}
