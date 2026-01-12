import { Game } from '@/db/types';
import { Organization, User } from '@/lib/auth';
import { createPlayerAuth } from '@/lib/player-auth';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { GET } from '..';

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
    const playerAuth = createPlayerAuth(game.id);
    const { token, user: player } = await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        token: token ?? '',
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
    const playerAuth = createPlayerAuth(game.id);
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
