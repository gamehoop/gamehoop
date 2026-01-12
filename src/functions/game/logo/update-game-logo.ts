import { buildKey, getObjectUrl, putObject } from '@/lib/s3';
import { gameStore } from '@/stores/game-store';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getUser } from '../../auth/get-user';

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

    return { gameId, logo };
  })
  .handler(async ({ data: { gameId, logo } }): Promise<void> => {
    const user = await getUser();
    const game = await gameStore.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    const key = buildKey(
      `organizations/${game.organizationId}/game/${gameId}/logo`,
    );
    const body = await logo.arrayBuffer();
    const contentType = logo.type;

    await putObject({
      key,
      body: body as unknown as Buffer,
      contentType,
    });

    const image = `${getObjectUrl(key)}?uploadedAt=${Date.now()}`;
    await gameStore.update({
      where: { id: gameId },
      data: {
        logo: image,
      },
    });
  });
