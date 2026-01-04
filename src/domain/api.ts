import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { gameStore } from '@/stores/game-store';
import { HttpStatus } from '@/utils/http';
import z from 'zod';
import { hashApiKey } from './game-api-key';

export async function verifyApiAccess(
  request: Request,
  { gamePublicId }: { gamePublicId: string },
) {
  const token = getBearerToken(request);
  if (!token) {
    throw new Response('', { status: HttpStatus.Unauthorized });
  }

  const apiKeys = await gameApiKeyStore.getByGamePublicId(gamePublicId);
  const apiKey = apiKeys.find(
    ({ active, keyHash }) => active && keyHash === hashApiKey(token),
  );
  if (!apiKey) {
    throw new Response('', { status: HttpStatus.Forbidden });
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    throw new Response('Expired API key', { status: HttpStatus.Forbidden });
  }

  const game = await gameStore.getByPublicId(gamePublicId);
  if (!game) {
    throw new Response('Game not found', { status: HttpStatus.NotFound });
  }

  return { game };
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
    throw Response.json({ error: message }, { status: HttpStatus.BadRequest });
  }
}
