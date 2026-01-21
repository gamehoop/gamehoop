import { Game } from '@/db/types';
import { zGameEvent } from '@/domain/api/schemas';
import { Organization, User } from '@/libs/auth';
import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameEvents,
  createGameWithApiKey,
  createPlayer,
  createTestUser,
} from '@/utils/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GET } from '../events';

describe('GET /api/v1/admin/games/$gameId/events', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let token: string;
  let uri: string;

  beforeEach(async () => {
    let result = await createTestUser();
    user = result.user;
    organization = result.organization;

    const gameResult = await createGameWithApiKey({
      user,
      organization,
    });
    game = gameResult.game;
    token = gameResult.apiKey ?? '';

    uri = `v1/games/${game.id}/events`;
  });

  describe('authorized', () => {
    it('should return the events for a game', async () => {
      const events = await createGameEvents({ game });

      const res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri,
          token: token,
        }),
      });

      expect(res.status).toBe(HttpStatus.Ok);
      expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

      const body = await res.json();
      expect(body).toStrictEqual({
        data: expect.arrayContaining(
          events.map((event) => zGameEvent.parse(event)),
        ),
        total: events.length,
        page: 1,
        pageSize: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it('should support a pageSize query param', async () => {
      const events = await createGameEvents({ game });

      const res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri: `${uri}?pageSize=1`,
          token,
        }),
      });

      expect(res.status).toBe(HttpStatus.Ok);
      expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

      const event = events.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      )[0];

      const body = await res.json();
      expect(body).toStrictEqual({
        data: [zGameEvent.parse(event)],
        total: events.length,
        page: 1,
        pageSize: 1,
        hasNextPage: true,
        hasPrevPage: false,
      });
    });

    it('should support a page query param', async () => {
      const events = await createGameEvents({ game });

      const res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri: `${uri}?page=2&pageSize=1`,
          token,
        }),
      });

      expect(res.status).toBe(HttpStatus.Ok);
      expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

      const event = events.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      )[1];

      const body = await res.json();
      expect(body).toStrictEqual({
        data: [zGameEvent.parse(event)],
        total: events.length,
        page: 2,
        pageSize: 1,
        hasNextPage: true,
        hasPrevPage: true,
      });
    });

    it('should support sortBy/sortDir query params', async () => {
      const events = await createGameEvents({ game });

      let res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri: `${uri}?sortBy=timestamp&sortDir=asc`,
          token,
        }),
      });

      expect(res.status).toBe(HttpStatus.Ok);
      expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

      let body = await res.json();
      expect(body).toStrictEqual({
        data: events
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          .map((event) => zGameEvent.parse(event)),
        total: events.length,
        page: 1,
        pageSize: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });

      res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri: `${uri}?sortBy=name&sortDir=desc`,
          token,
        }),
      });

      expect(res.status).toBe(HttpStatus.Ok);
      expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

      body = await res.json();
      expect(body).toStrictEqual({
        data: events
          .sort((a, b) => b.name.localeCompare(a.name))
          .map((event) => zGameEvent.parse(event)),
        total: events.length,
        page: 1,
        pageSize: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it('should support filtering by playerId', async () => {
      const player = await createPlayer({ game });

      const events = await createGameEvents({ game, player });
      await createGameEvents({ game });

      const res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri: `${uri}?playerId=${player.id}`,
          token,
        }),
      });

      expect(res.status).toBe(HttpStatus.Ok);
      expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

      const body = await res.json();
      expect(body).toStrictEqual({
        data: events
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .map((event) => zGameEvent.parse(event)),
        total: events.length,
        page: 1,
        pageSize: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });
  });

  describe('unauthorized', () => {
    it('should return unauthorized if no apiKey is provided', async () => {
      const res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri,
        }),
      });

      expect(res.status).toBe(HttpStatus.Unauthorized);
    });

    it('should return unauthorized if the apiKey is invalid', async () => {
      const res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri,
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

      const res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri,
          token: apiKey ?? '',
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

      const res = await GET({
        params: { gameId: game.id },
        request: apiRequest({
          uri,
          token: apiKey ?? '',
        }),
      });

      expect(res.status).toBe(HttpStatus.Unauthorized);
    });
  });
});
