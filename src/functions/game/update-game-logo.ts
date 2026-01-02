import { buildKey, getObjectUrl, putObject } from '@/lib/s3';
import { gameStore } from '@/stores/game-store';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import { getSessionContext } from '../auth/get-session-context';

export const updateGameLogo = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator((formData) => {
    if (!(formData instanceof FormData)) {
      throw new TypeError('Invalid form data');
    }

    const gameId = formData.get('gameId') as string;
    if (!gameId) {
      throw new Error('gameId is required');
    }

    const logo = formData.get('logo') as File;
    if (!logo) {
      throw new Error('logo is required');
    }

    return { gameId: parseInt(gameId, 10), logo };
  })
  .handler(async ({ data: { gameId, logo } }): Promise<void> => {
    const {
      activeOrganization: { games, id: organizationId },
    } = await getSessionContext();

    const hasAccess = games.some((game) => game.id === gameId);
    if (!hasAccess) {
      throw new Error('Unauthorized');
    }

    const key = buildKey(
      `organizations/${organizationId}/games/${gameId}/logo`,
    );
    const body = await logo.arrayBuffer();
    const contentType = logo.type;

    await putObject({
      key,
      body: body as unknown as Buffer,
      contentType,
    });

    const image = `${getObjectUrl(key)}?uploadedAt=${Date.now()}`;
    await gameStore.update(gameId, {
      logo: image,
    });
  });
