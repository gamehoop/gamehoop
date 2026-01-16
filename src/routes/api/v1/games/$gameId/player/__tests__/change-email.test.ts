import { Game } from '@/db/types';
import { Organization, User } from '@/libs/auth';
import { createPlayerAuth } from '@/libs/player-auth';
import { HttpStatus } from '@/utils/http';
import { apiRequest, createGame, createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../change-email';

describe('POST /api/v1/games/$gameId/player/change-email', () => {
  let user: User;
  let organization: Organization;
  let game: Game;
  let uri: string;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
    game = await createGame({ user, organization });
    uri = `v1/games/${game.id}/player/change-email`;
  });

  it('should trigger a change email request', async () => {
    const { user, organization } = await createTestUser();
    const game = await createGame({ user, organization });

    const playerAuth = createPlayerAuth(game);
    const { token } = await playerAuth.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '',
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const newEmail = faker.internet.email();

    const mockChangeEmail = vi.fn().mockResolvedValue({});
    vi.spyOn(
      await import('@/libs/player-auth'),
      'createPlayerAuth',
    ).mockReturnValueOnce({
      changeEmail: mockChangeEmail,
    } as any);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Cookie: `better-auth.session_token=${token}`,
    };

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        headers,
        data: {
          newEmail,
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toBe('application/json');

    expect(mockChangeEmail).toHaveBeenCalledTimes(1);
    expect(mockChangeEmail).toHaveBeenCalledWith({
      body: {
        newEmail,
        callbackURL: `/games/${game.id}/change-email-requested`,
      },
      headers: new Headers(headers),
    });
  });

  it('should return not found if the game does not exist', async () => {
    const playerAuth = createPlayerAuth(game);
    const session = await playerAuth.signInAnonymous();
    const token = session?.token ?? '';

    const res = await POST({
      params: { gameId: faker.string.uuid() },
      request: apiRequest({
        uri,
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `better-auth.session_token=${token}`,
        },
        data: {
          newEmail: faker.internet.email(),
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it('should return bad request if body is invalid json', async () => {
    const playerAuth = createPlayerAuth(game);
    const session = await playerAuth.signInAnonymous();
    const token = session?.token ?? '';

    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `better-auth.session_token=${token}`,
        },
        body: '',
      }),
    });

    expect(res.status).toBe(HttpStatus.BadRequest);
  });

  it('should return unauthorized if the Cookie header is missing', async () => {
    const res = await POST({
      params: { gameId: game.id },
      request: apiRequest({
        uri,
        data: {
          newEmail: faker.internet.email(),
        },
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
