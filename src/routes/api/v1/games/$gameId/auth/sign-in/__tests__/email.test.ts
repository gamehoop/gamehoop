import { Game } from '@/db/types';
import { Organization, User } from '@/libs/auth';
import { createPlayerAuth } from '@/libs/player-auth';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { POST } from '../email';

describe('POST /api/v1/game/$gameId/auth/sign-in/email', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/auth/sign-in/email`;
  });

  it('should create and return a new player session', async () => {
    const playerDetails = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    };

    const playerAuth = createPlayerAuth(game);
    await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        ...playerDetails,
      },
    });

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        data: {
          email: playerDetails.email,
          password: playerDetails.password,
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Created);
    expect(res.headers.get('Content-Type')).toBe('application/json');

    const body = await res.json();
    expect(body).toStrictEqual({
      token: expect.any(String),
      player: {
        name: playerDetails.name,
        email: playerDetails.email,
        id: expect.any(String),
        emailVerified: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        image: null,
        lastLoginAt: null,
        isAnonymous: false,
        gameId: game.id,
      },
    });
  });

  it('should return unauthorized with an invalid email', async () => {
    const playerDetails = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    };

    const playerAuth = createPlayerAuth(game);
    await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '',
        ...playerDetails,
      },
    });

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        data: {
          email: faker.internet.email().toLowerCase(),
          password: playerDetails.email,
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return unauthorized with an invalid password', async () => {
    const playerDetails = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    };

    const playerAuth = createPlayerAuth(game);
    await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '',
        ...playerDetails,
      },
    });

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        data: {
          email: playerDetails.email,
          password: faker.internet.password(),
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);

    const body = await res.json();
    expect(body).toStrictEqual({
      error: 'Invalid email or password',
    });
  });

  it('should validate the email and password', async () => {
    const playerDetails = {
      email: 'invalid',
      password: '',
    };

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/auth/sign-in/email`,
        data: playerDetails,
      }),
    });

    expect(res.status).toBe(HttpStatus.BadRequest);

    const body = await res.json();
    expect(body).toStrictEqual({
      error: [
        expect.objectContaining({
          path: ['email'],
          message: 'Invalid email address',
        }),
        expect.objectContaining({
          path: ['password'],
          message: 'Too small: expected string to have >=1 characters',
        }),
      ],
    });
  });

  it('should return not found if the game does not exist', async () => {
    const res = await POST({
      params: { gameId: faker.string.uuid() },
      request: apiRequest({
        uri,
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it('should return bad request if body is invalid json', async () => {
    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({ uri, body: '' }),
    });

    expect(res.status).toBe(HttpStatus.BadRequest);
  });
});
