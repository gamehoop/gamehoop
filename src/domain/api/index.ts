import { Game, Player } from '@/db/types';
import { logError } from '@/libs/logger';
import { createPlayerAuth } from '@/libs/player-auth';
import { gameApiKeyRepo } from '@/repos/game-api-key-repo';
import { gameRepo } from '@/repos/game-repo';
import { playerRepo } from '@/repos/player-repo';
import { badRequest, notFound, serverError, unauthorized } from '@/utils/http';
import z, { ZodError } from 'zod';
import { hashApiKey, Scope } from '../game-api-key';

const sessionTokenKey = `gamehoop.session_token`;

export async function verifyApiToken({
  request,
  gameId,
  scopes,
}: {
  request: Request;
  gameId: string;
  scopes?: Scope[];
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

  const missingScopes =
    scopes?.filter((scope) => !apiKey.scopes.includes(scope)) ?? [];
  const hasAllScope = apiKey.scopes.includes(Scope.All);
  if (missingScopes.length && !hasAllScope) {
    throw unauthorized({
      error: `Missing required scopes: ${missingScopes.join(', ')}`,
    });
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
    let message: string | Array<{ path: PropertyKey[]; message: string }> =
      'Unknown error';

    if (error instanceof ZodError) {
      message = error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));
    } else if (error instanceof Error) {
      message = error.message;
    }

    throw badRequest({ error: message });
  }
}

export function parseParams<S extends z.ZodObject>(
  request: Request,
  schema: S,
): z.infer<S> {
  try {
    const url = new URL(request.url);
    return schema.parse(Object.fromEntries(url.searchParams));
  } catch (error) {
    let message: string | Array<{ path: PropertyKey[]; message: string }> =
      'Unknown error';

    if (error instanceof ZodError) {
      message = error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));
    } else if (error instanceof Error) {
      message = error.message;
    }

    throw badRequest({ error: message });
  }
}

export function parseSessionToken(headers: Headers): string | null {
  const match = headers
    .get('Set-Cookie')
    ?.match(/gamehoop\.session_token=([^;]+)/);
  return match?.[1] ?? null;
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
  {
    request,
    gameId,
    scopes,
  }: { request: Request; gameId: string; scopes?: Scope[] },
  handler: ({ game }: { game: Game }) => Promise<Response>,
) {
  try {
    await verifyApiToken({ request, gameId, scopes });

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
    scopes,
  }: { request: Request; gameId: string; playerId: string; scopes?: Scope[] },
  handler: ({
    game,
    player,
  }: {
    game: Game;
    player: Player;
  }) => Promise<Response>,
) {
  return adminApiHandler({ request, gameId, scopes }, async ({ game }) => {
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
    headers,
    token,
  }: {
    game: Game;
    player: Player;
    headers: HeadersInit;
    token: string;
  }) => Promise<Response>,
) {
  const token = getBearerToken(request);
  if (!token) {
    return unauthorized();
  }

  const headers: HeadersInit = {
    Cookie: `${sessionTokenKey}=${token}`,
  };

  return gameApiHandler({ request, gameId }, async ({ game }) => {
    const session = await createPlayerAuth(game).getSession({ headers });

    const player = session?.user as Player;
    if (!player || player.gameId !== game.id) {
      return unauthorized();
    }

    return handler({ game, player, headers, token });
  });
}
