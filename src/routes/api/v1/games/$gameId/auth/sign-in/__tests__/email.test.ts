import { createPlayerAuth } from '@/lib/player-auth';
import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameWithApiKey,
  createTestUser,
} from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { POST } from '../email';

describe('POST /api/v1/game/$gamePublicId/auth/sign-in/email', () => {
  it('should create and return a new player session', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerDetails = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    };

    await createPlayerAuth(game.id).api.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '/player-verified',
        ...playerDetails,
      },
    });

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/games/${game.publicId}/auth/sign-in/email`,
        apiKey,
        data: {
          email: playerDetails.email,
          password: playerDetails.password,
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Created);

    const body = await res.json();
    expect(body).toEqual({
      token: expect.any(String),
      player: {
        name: playerDetails.name,
        email: playerDetails.email,
        id: expect.any(String),
        emailVerified: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        image: null,
        gameId: game.publicId,
      },
    });
  });

  it('should error with an invalid email', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerDetails = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    };

    await createPlayerAuth(game.id).api.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '/player-verified',
        ...playerDetails,
      },
    });

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/games/${game.publicId}/auth/sign-in/email`,
        apiKey,
        data: {
          email: faker.internet.email().toLowerCase(),
          password: playerDetails.email,
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should error with an invalid password', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerDetails = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    };

    await createPlayerAuth(game.id).api.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '/player-verified',
        ...playerDetails,
      },
    });

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/games/${game.publicId}/auth/sign-in/email`,
        apiKey,
        data: {
          email: playerDetails.email,
          password: faker.internet.password(),
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should validate the email and password', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerDetails = {
      email: 'invalid',
      password: 'short',
    };

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest({
        uri: `v1/games/${game.publicId}/auth/sign-in/email`,
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
          message: 'Invalid email address',
        }),
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
      request: apiRequest({ uri: `v1/games/${gameId}/auth/sign-in/email` }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require a valid API token', async () => {
    const gameId = faker.string.uuid();

    const res = await POST({
      params: { gameId },
      request: apiRequest({
        uri: `v1/games/${gameId}/auth/sign-in/email`,
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
        uri: `v1/games/${gameId}/auth/sign-in/email`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
