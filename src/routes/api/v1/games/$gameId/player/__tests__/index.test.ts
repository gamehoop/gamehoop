import { Game } from '@/db/types';
import { parseSessionToken } from '@/domain/api';
import { Organization, User } from '@/libs/auth';
import { createPlayerAuth } from '@/libs/player-auth';
import { playerRepo } from '@/repos/player-repo';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { DELETE, GET } from '..';

describe('GET /api/v1/games/$gameId/player', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/player`;
  });

  it('should return the current player data', async () => {
    const playerAuth = createPlayerAuth(game);
    const {
      headers,
      response: { user: player },
    } = await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
      returnHeaders: true,
    });

    const token = parseSessionToken(headers);

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        token: token ?? '',
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

    const body = await res.json();
    expect(body).toStrictEqual({
      id: player.id,
      name: player.name,
      email: player.email,
      emailVerified: false,
      image: null,
      isAnonymous: false,
      lastLoginAt: null,
      gameId: game.id,
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
    });
  });

  it('should return unauthorized if a player does not exist for the token', async () => {
    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        token: 'unknown',
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return not found if the game does not exist', async () => {
    const playerAuth = createPlayerAuth(game);
    const session = await playerAuth.signInAnonymous();

    const res = await GET({
      params: { gameId: faker.string.uuid() },
      request: apiRequest({
        uri,
        token: session?.token,
      }),
    });

    expect(res.status).toBe(HttpStatus.NotFound);
  });
});

describe('DELETE /api/v1/games/$gameId/player', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/player`;
  });

  it('should delete the current player', async () => {
    const playerAuth = createPlayerAuth(game);
    const { headers } = await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
      returnHeaders: true,
    });

    const token = parseSessionToken(headers);

    const startCount = await playerRepo.count();

    let res = await DELETE({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        token: token ?? '',
      }),
    });

    expect(res.status).toBe(HttpStatus.NoContent);
    expect(res.headers.get('Content-Type')).toBeNull();

    const endCount = await playerRepo.count();
    expect(endCount).toBe(startCount - 1);

    res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        token: token ?? '',
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return unauthorized if a player does not exist for the token', async () => {
    const res = await DELETE({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        token: 'unknown',
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return not found if the game does not exist', async () => {
    const playerAuth = createPlayerAuth(game);
    const session = await playerAuth.signInAnonymous();

    const res = await DELETE({
      params: { gameId: faker.string.uuid() },
      request: apiRequest({
        uri,
        token: session?.token,
      }),
    });

    expect(res.status).toBe(HttpStatus.NotFound);
  });
});
