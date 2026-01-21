import { Game } from '@/db/types';
import { parseSessionToken } from '@/domain/api';
import { Organization, User } from '@/libs/auth';
import { createPlayerAuth } from '@/libs/player-auth';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { POST } from '..';

describe('POST /api/v1/games/$gameId/events', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/events`;
  });

  it('should create a game event', async () => {
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

    const data = {
      name: faker.lorem.word(),
      properties: {
        [faker.lorem.word()]: faker.number.int({ max: 100 }),
        [faker.lorem.word()]: faker.datatype.boolean(),
      },
      timestamp: new Date().toISOString(),
      sessionId: faker.string.uuid(),
      deviceId: faker.string.uuid(),
    };

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        token: token ?? '',
        data,
      }),
    });

    expect(res.status).toBe(HttpStatus.Created);
    expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

    const body = await res.json();
    expect(body).toStrictEqual({
      createdAt: expect.any(String),
      deviceId: data.deviceId,
      gameId: game.id,
      playerId: player.id,
      id: expect.any(String),
      name: data.name,
      properties: data.properties,
      timestamp: data.timestamp,
      sessionId: data.sessionId,
    });
  });

  it('should return unauthorized if a player does not exist for the token', async () => {
    const res = await POST({
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

    const res = await POST({
      params: { gameId: faker.string.uuid() },
      request: apiRequest({
        uri,
        token: session?.token,
      }),
    });

    expect(res.status).toBe(HttpStatus.NotFound);
  });
});
