import { Game } from '@/db/types';
import { Organization, User } from '@/lib/auth';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { POST } from '../email';

describe('POST /api/v1/games/$gameId/auth/sign-up/email', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/auth/sign-up/email`;
  });

  it('should create a new player account and session', async () => {
    const playerDetails = {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
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

  it('should validate the player details', async () => {
    const playerDetails = {};

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
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
    const playerDetails = {
      email: faker.internet.email().toLowerCase(),
      name: faker.person.fullName(),
      password: 'short',
    };

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
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

  it('should return 404 if the game does not exist', async () => {
    const playerDetails = {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };

    const res = await POST({
      params: { gameId: faker.string.uuid() },
      request: apiRequest({
        uri,
        data: playerDetails,
      }),
    });

    expect(res.status).toBe(HttpStatus.NotFound);
  });
});
