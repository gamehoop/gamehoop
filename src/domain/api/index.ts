import { Game, Player } from '@/db/types';
import { logError } from '@/libs/logger';
import { gameApiKeyRepo } from '@/repos/game-api-key-repo';
import { gameRepo } from '@/repos/game-repo';
import { playerRepo } from '@/repos/player-repo';
import { badRequest, notFound, serverError, unauthorized } from '@/utils/http';
import z, { ZodError } from 'zod';
import { hashApiKey } from '../game-api-key';

export async function verifyApiToken({
  request,
  gameId,
}: {
  request: Request;
  gameId: string;
}) {
  const token = getBearerToken(request);
  if (!token) {
    throw unauthorized();
  }

  const apiKey = await gameApiKeyRepo.findOneForGame({
    gameId,
    keyHash: hashApiKey(token),
  });
  if (!apiKey) {
    throw unauthorized();
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

export async function apiHandler(
  request: Request,
  handler: (request: Request) => Promise<Response>,
) {
  try {
    return await handler(request);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    logError(error);
    return serverError();
  }
}

export async function gameApiHandler(
  { request, gameId }: { request: Request; gameId: string },
  handler: ({ game }: { game: Game }) => Promise<Response>,
) {
  return apiHandler(request, async () => {
    const game = await gameRepo.findOne({ where: { id: gameId } });
    if (!game) {
      return notFound();
    }

    return handler({ game });
  });
}

export async function adminApiHandler(
  { request, gameId }: { request: Request; gameId: string },
  handler: ({ game }: { game: Game }) => Promise<Response>,
) {
  try {
    await verifyApiToken({ request, gameId });

    const game = await gameRepo.findOne({ where: { id: gameId } });
    if (!game) {
      return notFound();
    }

    return await handler({ game });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    logError(error);
    return serverError();
  }
}

export async function adminPlayerApiHandler(
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
  return adminApiHandler({ request, gameId }, async ({ game }) => {
    const player = await playerRepo.findOne({ where: { id: playerId } });
    if (!player || player.gameId !== game.id) {
      return unauthorized();
    }

    return handler({ game, player });
  });
}

export async function playerApiHandler(
  { request, gameId }: { request: Request; gameId: string },
  handler: ({
    game,
    player,
    token,
  }: {
    game: Game;
    player: Player;
    token: string;
  }) => Promise<Response>,
) {
  const token = getBearerToken(request);
  if (!token) {
    return unauthorized();
  }

  return gameApiHandler({ request, gameId }, async ({ game }) => {
    const player = await playerRepo.findOneForSession(token);
    if (!player || player.gameId !== game.id) {
      return unauthorized();
    }

    return handler({ game, player, token });
  });
}
