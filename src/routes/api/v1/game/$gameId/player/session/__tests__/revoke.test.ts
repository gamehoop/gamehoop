import { createPlayerAuth } from '@/lib/player-auth';
import { playerSessionStore } from '@/stores/player-session-store';
import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameWithApiKey,
  createTestUser,
} from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { DELETE } from '../revoke';

describe('/api/v1/game/$gamePublicId/player/session/revoke', () => {
  it('should delete the session for a given token', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const session = await createPlayerAuth(game.id).api.signInAnonymous();

    expect(
      await playerSessionStore.findOne({ where: { token: session?.token } }),
    ).toBeDefined();

    const res = await DELETE({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/game/${game.publicId}/player/session/revoke`,
        apiKey,
        data: {
          token: session?.token,
        },
      }),
    });

    expect(res.status).toEqual(HttpStatus.NoContent);

    expect(
      await playerSessionStore.findOne({ where: { token: session?.token } }),
    ).not.toBeDefined();
  });

  it('should require an API token', async () => {
    const gameId = faker.string.uuid();

    const res = await DELETE({
      params: { gameId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/session/revoke`,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require a valid API token', async () => {
    const gameId = faker.string.uuid();

    const res = await DELETE({
      params: { gameId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/session/revoke`,
        apiKey: 'invalid',
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require an active API token', async () => {
    const { user, organization } = await createTestUser();
    const { apiKey } = await createGameWithApiKey({
      user,
      organization,
      expired: true,
    });

    const gameId = faker.string.uuid();

    const res = await DELETE({
      params: { gameId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/session/revoke`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
