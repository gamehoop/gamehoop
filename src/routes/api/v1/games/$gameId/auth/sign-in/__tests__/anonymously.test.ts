import { Game } from '@/db/types';
import { Organization, User } from '@/libs/auth';
import { playerRepo } from '@/repos/player-repo';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { POST } from '../anonymously';

describe('POST /api/v1/games/$gameId/auth/sign-in/anonymously', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/auth/sign-in/anonymously`;
  });

  it('should create and return an anonymous player session', async () => {
    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({ uri }),
    });

    expect(res.status).toBe(HttpStatus.Created);
    expect(res.headers.get('Set-Cookie')).contains('session_token');
    expect(res.headers.get('Content-Type')).toBe('application/json');

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
    const startCount = await playerRepo.count();

    let res = await POST({
      params: { gameId: game.id },
      request: apiRequest({ uri }),
    });

    expect(res.status).toBe(HttpStatus.Created);

    const { player } = await res.json();

    res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
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

    const endCount = await playerRepo.count();
    expect(endCount).toEqual(startCount + 1);
  });

  it('should use a given player name', async () => {
    const name = faker.person.fullName();

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        data: { name },
      }),
    });

    expect(res.status).toBe(HttpStatus.Created);

    const { player } = await res.json();
    expect(player.name).toEqual(name);
  });

  it('should return 404 if the game does not exist', async () => {
    const res = await POST({
      params: { gameId: faker.string.uuid() },
      request: apiRequest({ uri }),
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
