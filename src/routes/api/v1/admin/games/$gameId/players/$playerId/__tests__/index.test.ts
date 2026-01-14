import { Organization, User } from '@/libs/auth';
import { createPlayerAuth } from '@/libs/player-auth';
import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameWithApiKey,
  createTestUser,
} from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { GET } from '..';

describe('GET /api/v1/admin/games/$gameId/players/$playerId', () => {
  let user: User;
  let organization: Organization;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
  });

  it('should return the player data', async () => {
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const playerAuth = createPlayerAuth(game);
    const { user: player } = await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const res = await GET({
      params: { gameId: game.id, playerId: player.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players/${player.id}`,
        token: apiKey ?? '',
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

  it('should return unauthorized if no apiKey is provided', async () => {
    const { game } = await createGameWithApiKey({ user, organization });

    const playerAuth = createPlayerAuth(game);
    const { user: player } = await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const res = await GET({
      params: { gameId: game.id, playerId: player.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players/${player.id}`,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return unauthorized if the apiKey is invalid', async () => {
    const { game } = await createGameWithApiKey({ user, organization });

    const playerAuth = createPlayerAuth(game);
    const { user: player } = await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const res = await GET({
      params: { gameId: game.id, playerId: player.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players/${player.id}`,
        token: 'invalid',
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
