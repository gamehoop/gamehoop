import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameWithApiKey,
  createTestUser,
} from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { POST } from '../anonymously';

describe('/api/v1/game/$gamePublicId/player/sign-in/anonymously', () => {
  it('should create and return an anonymous player session', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/game/${game.publicId}/player/sign-in/anonymously`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Created);

    const body = await res.json();
    expect(body).toEqual({
      token: expect.any(String),
      player: {
        name: expect.any(String),
        email: expect.any(String),
        id: expect.any(String),
        emailVerified: false,
        gameId: game.id,
        image: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('should reuse a given player identifier', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    let res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/game/${game.publicId}/player/sign-in/anonymously`,
        apiKey,
      }),
    });

    const { player } = await res.json();

    res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/game/${game.publicId}/player/sign-in/anonymously`,
        apiKey,
        data: { playerId: player.id },
      }),
    });

    expect(res.status).toBe(HttpStatus.Created);
    const body = await res.json();
    expect(body).toEqual({
      token: expect.any(String),
      player: expect.objectContaining({
        id: player.id,
        email: player.email,
        name: player.name,
      }),
    });
  });

  it('should require an API token', async () => {
    const gameId = faker.string.uuid();

    const res = await POST({
      params: { gameId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/sign-in/anonymously`,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require a valid API token', async () => {
    const gameId = faker.string.uuid();

    const res = await POST({
      params: { gameId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/sign-in/anonymously`,
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

    const res = await POST({
      params: { gameId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/sign-in/anonymously`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
