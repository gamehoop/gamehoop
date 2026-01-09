import { createPlayerAuth } from '@/lib/player-auth';
import { HttpStatus } from '@/utils/http';
import {
  apiRequest,
  createGameWithApiKey,
  createTestUser,
} from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { describe, expect, it, vi } from 'vitest';
import { POST } from '../reset-password';

describe('/api/v1/game/$gamePublicId/player/$playerId/reset-password', () => {
  it('should send a reset password email', async () => {
    const { user, organization } = await createTestUser();
    const { game, apiKey } = await createGameWithApiKey({ user, organization });

    const { user: player } = await createPlayerAuth(game.id).api.signUpEmail({
      body: {
        gameId: game.id,
        callbackURL: '/player-verified',
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const mockRequestPasswordReset = vi.fn().mockResolvedValue({});
    vi.spyOn(
      await import('@/lib/player-auth'),
      'createPlayerAuth',
    ).mockReturnValueOnce({
      api: {
        requestPasswordReset: mockRequestPasswordReset,
      },
    } as any);

    const res = await POST({
      params: { gameId: game.publicId, playerId: player.id },
      request: apiRequest({
        uri: `v1/game/${game.publicId}/player/${player.id}/reset-password`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Ok);

    expect(mockRequestPasswordReset).toHaveBeenCalledTimes(1);
    expect(mockRequestPasswordReset).toHaveBeenCalledWith({
      body: {
        email: player.email,
        redirectTo: '/player/reset-password',
      },
    });
  });

  it('should require an API token', async () => {
    const gameId = faker.string.uuid();
    const playerId = faker.string.uuid();

    const res = await POST({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/${playerId}/reset-password`,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require a valid API token', async () => {
    const gameId = faker.string.uuid();
    const playerId = faker.string.uuid();

    const res = await POST({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/${playerId}/reset-password`,
        apiKey: 'invalid',
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require an active API token', async () => {
    const { user, organization } = await createTestUser();
    const { apiKey } = await createGameWithApiKey({
      user,
      organization,
      expired: true,
    });

    const gameId = faker.string.uuid();
    const playerId = faker.string.uuid();

    const res = await POST({
      params: { gameId, playerId },
      request: apiRequest({
        uri: `v1/game/${gameId}/player/${playerId}/reset-password`,
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
