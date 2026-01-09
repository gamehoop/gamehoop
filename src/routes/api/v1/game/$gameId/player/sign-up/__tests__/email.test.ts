import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameWithApiKey,
  createTestUser,
} from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { POST } from '../email';

describe('/api/v1/game/$gamePublicId/player/sign-up/email', () => {
  it('should create a player and session', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerDetails = {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/game/${game.publicId}/player/sign-up/email`,
        apiKey,
        data: playerDetails,
      }),
    });

    expect(res.status).toBe(HttpStatus.Created);

    const body = await res.json();
    expect(body.token).toEqual(expect.any(String));
    expect(body.player).toEqual({
      name: playerDetails.name,
      email: playerDetails.email,
      id: expect.any(String),
      emailVerified: false,
      gameId: game.id,
      image: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should validate the body', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerDetails = {};

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/game/${game.publicId}/player/sign-up/email`,
        apiKey,
        data: playerDetails,
      }),
    });

    expect(res.status).toBe(HttpStatus.BadRequest);

    const body = await res.json();
    expect(body).toEqual({
      error: [
        expect.objectContaining({
          path: ['email'],
          message: 'Invalid input: expected string, received undefined',
        }),
        expect.objectContaining({
          path: ['password'],
          message: 'Invalid input: expected string, received undefined',
        }),
        expect.objectContaining({
          path: ['name'],
          message: 'Invalid input: expected string, received undefined',
        }),
      ],
    });
  });

  it('should require passwords to have a min length', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerDetails = {
      email: faker.internet.email().toLowerCase(),
      name: faker.person.fullName(),
      password: 'short',
    };

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/game/${game.publicId}/player/sign-up/email`,
        apiKey,
        data: playerDetails,
      }),
    });

    expect(res.status).toBe(HttpStatus.BadRequest);

    const body = await res.json();
    expect(body).toEqual({
      error: [
        expect.objectContaining({
          path: ['password'],
          message: 'Too small: expected string to have >=8 characters',
        }),
      ],
    });
  });

  it('should require an API token', async () => {
    const gameId = faker.string.uuid();

    const res = await POST({
      params: { gameId },
      request: apiRequest({ uri: `v1/game/${gameId}/player/sign-up/email` }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require a valid API token', async () => {
    const gameId = faker.string.uuid();

    const res = await POST({
      params: { gameId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/sign-up/email`,
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
        uri: `v1/game/${gameId}/player/sign-up/email`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
