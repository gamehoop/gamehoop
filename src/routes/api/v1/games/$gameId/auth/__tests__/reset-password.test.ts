import { Game } from '@/db/types';
import { Organization, User } from '@/libs/auth';
import { createPlayerAuth } from '@/libs/player-auth';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../reset-password';

describe('POST /api/v1/games/$gameId/auth/reset-password', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/auth/reset-password`;
  });

  it('should send a reset password email', async () => {
    const { user, organization } = await createTestUser();
    const game = await createGame({ user, organization });

    const { user: player } = await createPlayerAuth(game).signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '',
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const mockRequestPasswordReset = vi.fn().mockResolvedValue({});
    vi.spyOn(
      await import('@/libs/player-auth'),
      'createPlayerAuth',
    ).mockReturnValueOnce({
      requestPasswordReset: mockRequestPasswordReset,
    } as any);

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        data: {
          email: player.email,
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toBe('application/json');

    expect(mockRequestPasswordReset).toHaveBeenCalledTimes(1);
    expect(mockRequestPasswordReset).toHaveBeenCalledWith({
      body: {
        email: player.email,
        redirectTo: `/games/${game.id}/reset-password`,
      },
    });
  });

  it('should return not found if the game does not exist', async () => {
    const res = await POST({
      params: { gameId: faker.string.uuid() },
      request: apiRequest({
        uri,
        data: {
          email: faker.string.uuid(),
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it('should return unprocessable entity if the player does not exist', async () => {
    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.UnprocessableEntity);
  });

  it('should return bad request if body is invalid json', async () => {
    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        body: '',
      }),
    });

    expect(res.status).toBe(HttpStatus.BadRequest);
  });
});
