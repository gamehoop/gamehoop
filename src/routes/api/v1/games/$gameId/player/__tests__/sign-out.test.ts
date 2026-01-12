import { Game } from '@/db/types';
import { Organization, User } from '@/lib/auth';
import { createPlayerAuth } from '@/lib/player-auth';
import { playerSessionStore } from '@/stores/player-session-store';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { DELETE } from '../sign-out';

describe('DELETE /api/v1/games/$gameId/player/sign-out', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/player/sign-out`;
  });

  it('should delete the session for a given token', async () => {
    const playerAuth = createPlayerAuth(game.id);
    const session = await playerAuth.signInAnonymous();

    expect(
      await playerSessionStore.findOne({ where: { token: session?.token } }),
    ).toBeDefined();

    const res = await DELETE({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        token: session?.token,
      }),
    });

    expect(res.status).toEqual(HttpStatus.NoContent);

    expect(
      await playerSessionStore.findOne({ where: { token: session?.token } }),
    ).not.toBeDefined();
  });

  it('should require a session token', async () => {
    const gameId = faker.string.uuid();

    const res = await DELETE({
      params: { gameId },
      request: apiRequest({
        uri,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should return not found if the game does not exist', async () => {
    const playerAuth = createPlayerAuth(game.id);
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
