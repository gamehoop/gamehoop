import { createPlayerAuth } from '@/lib/player-auth';
import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameWithApiKey,
  createTestUser,
} from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { GET } from '..';

describe('GET /api/v1/games/$gamePublicId/players/$playerId', () => {
  it('should return player data', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const { user: player } = await createPlayerAuth(game.id).api.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '/player-verified',
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const res = await GET({
      params: { gameId: game.publicId, playerId: player.id },
      request: apiRequest({
        uri: `v1/games/${game.publicId}/players/${player.id}`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);

    const body = await res.json();
    expect(body).toEqual({
      id: player.id,
      name: player.name,
      email: player.email,
      emailVerified: false,
      image: null,
      gameId: game.publicId,
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
    });
  });

  it('should return not found if the player does not exist', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerId = faker.string.uuid();
    const res = await GET({
      params: { gameId: game.publicId, playerId },
      request: apiRequest({
        uri: `v1/games/${game.publicId}/players/${playerId}`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it('should require an API token', async () => {
    const gameId = faker.string.uuid();
    const playerId = faker.string.uuid();

    const res = await GET({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/games/${gameId}/players/${playerId}`,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require a valid API token', async () => {
    const gameId = faker.string.uuid();
    const playerId = faker.string.uuid();

    const res = await GET({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/games/${gameId}/players/${playerId}`,
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

    const res = await GET({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/games/${gameId}/players/${playerId}`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
