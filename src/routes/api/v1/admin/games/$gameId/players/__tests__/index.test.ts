import { zPlayer } from '@/domain/api/schemas';
import { Organization, User } from '@/libs/auth';
import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameWithApiKey,
  createPlayers,
  createTestUser,
} from '@/utils/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GET } from '..';

describe('GET /api/v1/admin/games/$gameId/players', () => {
  let user: User;
  let organization: Organization;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
  });

  it('should return the player data', async () => {
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const players = await createPlayers({ game, n: 3 });

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players`,
        token: apiKey ?? '',
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toEqual('application/json');

    const body = await res.json();
    expect(body).toEqual({
      data: expect.arrayContaining(
        players.map((player) => zPlayer.parse(player)),
      ),
      total: players.length,
      page: 1,
      pageSize: 20,
      hasNextPage: false,
      hasPrevPage: false,
    });
  });

  it('should support a pageSize query param', async () => {
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const players = await createPlayers({ game, n: 3 });

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players?pageSize=1`,
        token: apiKey ?? '',
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toEqual('application/json');

    const body = await res.json();
    expect(body).toEqual({
      data: [zPlayer.parse(players[2])],
      total: players.length,
      page: 1,
      pageSize: 1,
      hasNextPage: true,
      hasPrevPage: false,
    });
  });

  it('should support a page query param', async () => {
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const players = await createPlayers({ game, n: 3 });

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players?page=2&pageSize=1`,
        token: apiKey ?? '',
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toEqual('application/json');

    const body = await res.json();
    expect(body).toEqual({
      data: [zPlayer.parse(players[1])],
      total: players.length,
      page: 2,
      pageSize: 1,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });

  it('should support sortBy/sortDir query params', async () => {
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const players = await createPlayers({ game, n: 3 });

    let res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players?sortBy=createdAt&sortDir=asc`,
        token: apiKey ?? '',
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toEqual('application/json');

    let body = await res.json();
    expect(body).toEqual({
      data: players
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((player) => zPlayer.parse(player)),
      total: players.length,
      page: 1,
      pageSize: 20,
      hasNextPage: false,
      hasPrevPage: false,
    });

    res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players?sortBy=name&sortDir=desc`,
        token: apiKey ?? '',
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toEqual('application/json');

    body = await res.json();
    expect(body).toEqual({
      data: players
        .sort((a, b) => b.name.localeCompare(a.name))
        .map((player) => zPlayer.parse(player)),
      total: players.length,
      page: 1,
      pageSize: 20,
      hasNextPage: false,
      hasPrevPage: false,
    });
  });

  it('should return unauthorized if no apiKey is provided', async () => {
    const { game } = await createGameWithApiKey({ user, organization });

    await createPlayers({ game, n: 3 });

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players`,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return unauthorized if the apiKey is invalid', async () => {
    const { game } = await createGameWithApiKey({ user, organization });

    await createPlayers({ game, n: 3 });

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players`,
        token: 'invalid',
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return unauthorized if the apiKey is expired', async () => {
    const { game, apiKey } = await createGameWithApiKey({
      user,
      organization,
      expired: true,
    });

    await createPlayers({ game, n: 3 });

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players`,
        token: apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return unauthorized if the apiKey is inactive', async () => {
    const { game, apiKey } = await createGameWithApiKey({
      user,
      organization,
      active: false,
    });

    await createPlayers({ game, n: 3 });

    const res = await GET({
      params: { gameId: game.id },
      request: apiRequest({
        uri: `v1/games/${game.id}/players`,
        token: apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
