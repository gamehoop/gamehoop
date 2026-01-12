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
import { DELETE } from '../sign-out';

describe('DELETE /api/v1/games/$gameId/players/$playerId/sign-out', () => {
  it('should delete the session for a given token', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const session = await createPlayerAuth(game.id).api.signInAnonymous();
    const sessionToken = session?.token;
    const player = session?.user;

    expect(
      await playerSessionStore.findOne({ where: { token: session?.token } }),
    ).toBeDefined();

    const res = await DELETE({
      params: { gameId: game.id, playerId: player?.id ?? '' },

      request: apiRequest({
        uri: `v1/games/${game.id}/players/$playerId/sign-out`,
        apiKey,
        sessionToken,
      }),
    });

    expect(res.status).toEqual(HttpStatus.NoContent);

    expect(
      await playerSessionStore.findOne({ where: { token: session?.token } }),
    ).not.toBeDefined();
  });

  it('should require a session token', async () => {
    const { user, organization } = await createTestUser();
    const { apiKey } = await createGameWithApiKey({ user, organization });

    const gameId = faker.string.uuid();
    const playerId = faker.string.uuid();

    const res = await DELETE({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/games/${gameId}/players/$playerId/sign-out`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require an API token', async () => {
    const gameId = faker.string.uuid();
    const playerId = faker.string.uuid();

    const res = await DELETE({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/games/${gameId}/players/$playerId/sign-out`,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require a valid API token', async () => {
    const gameId = faker.string.uuid();
    const playerId = faker.string.uuid();

    const res = await DELETE({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/games/${gameId}/players/$playerId/sign-out`,
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
    const playerId = faker.string.uuid();

    const res = await DELETE({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/games/${gameId}/players/$playerId/sign-out`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
