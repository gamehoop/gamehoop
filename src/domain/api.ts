import { Game, Player } from '@/db/types';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { gameStore } from '@/stores/game-store';
import { playerStore } from '@/stores/player-store';
import { badRequest, notFound, serverError, unauthorized } from '@/utils/http';
import z, { ZodError } from 'zod';
import { hashApiKey } from './game-api-key';

export async function verifyApiToken(
  request: Request,
  { gameId }: { gameId: string },
) {
  const token = getBearerToken(request);
  if (!token) {
    throw unauthorized({ error: 'Unauthorized' });
  }

  const apiKeys = await gameApiKeyStore.findForGame(gameId);
  const apiKey = apiKeys.find(
    ({ active, keyHash }) => active && keyHash === hashApiKey(token),
  );
  if (!apiKey) {
    throw unauthorized({ error: 'Unauthorized' });
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    throw unauthorized({ error: 'Expired API key' });
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
    let message: string | z.core.$ZodIssue[] = 'Unknown error';
    if (error instanceof ZodError) {
      message = error.issues;
    } else if (error instanceof Error) {
      message = error.message;
    }
    throw badRequest({ error: message });
  }
}

export async function withGameAccess(
  { request, gameId }: { request: Request; gameId: string },
  handler: ({ game }: { game: Game }) => Promise<Response>,
) {
  try {
    await verifyApiToken(request, { gameId });

    const game = await gameStore.findOne({ where: { id: gameId } });
    if (!game) {
      throw notFound();
    }

    return await handler({ game });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return serverError();
  }
}

export async function withPlayerAccess(
  {
    request,
    gameId,
    playerId,
  }: { request: Request; gameId: string; playerId: string },
  handler: ({
    game,
    player,
  }: {
    game: Game;
    player: Player;
  }) => Promise<Response>,
) {
  return withGameAccess({ gameId, request }, async ({ game }) => {
    const player = await playerStore.findOne({
      where: { id: playerId, gameId: game.id },
    });

    if (!player) {
      throw notFound();
    }

    return handler({ game, player });
  });
}
