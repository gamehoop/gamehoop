import { Scope } from '@/domain/game-api-key';
import { auth, Session } from '@/libs/auth';
import { gameApiKeyRepo } from '@/repos/game-api-key-repo';
import { gameRepo } from '@/repos/game-repo';
import { createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { describe, expect, it, vi } from 'vitest';
import { createGameApiKey } from '../create-game-api-key';

describe('create-game-api-key serverFn', () => {
  const mockUser = { id: faker.string.uuid() };

  it('should generate an api key and store the hash', async () => {
    const { user, organization } = await createTestUser();

    vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user,
    } as Session);

    const createApiKeySpy = vi.spyOn(gameApiKeyRepo, 'create');

    const game = await gameRepo.create({
      name: faker.lorem.word(),
      organizationId: organization.id,
      createdBy: user.id,
      updatedBy: user.id,
    });

    const result = await createGameApiKey({
      data: {
        gameId: game.id,
        scopes: [Scope.All],
      },
    });

    expect(result).toStrictEqual({
      apiKey: expect.any(String),
      gameId: game.id,
      scopes: [Scope.All],
      createdBy: user.id,
      createdAt: expect.any(Date),
      description: null,
      expiresAt: null,
      keyHash: expect.any(String),
      lastUsedAt: null,
      id: expect.any(String),
      active: true,
    });

    expect(result.apiKey).not.toStrictEqual(result.keyHash);

    expect(createApiKeySpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the game is not found', async () => {
    vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user: mockUser,
    } as Session);

    await expect(
      createGameApiKey({
        data: {
          gameId: faker.string.uuid(),
          scopes: [Scope.All],
        },
      }),
    ).rejects.toThrow(expect.objectContaining({ isNotFound: true }));
  });

  it('should throw an error when not authenticated', async () => {
    await expect(
      createGameApiKey({
        data: {
          gameId: faker.string.uuid(),
          scopes: [Scope.All],
        },
      }),
    ).rejects.toThrowError('Unauthorized');
  });

  it('should validate the body', async () => {
    await expect(
      createGameApiKey({
        data: {
          expiresAt: faker.date.past().toISOString(),
        } as any,
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'ZodError',
        issues: [
          expect.objectContaining({
            path: ['gameId'],
            message: 'Invalid input: expected string, received undefined',
          }),
          expect.objectContaining({
            path: ['scopes'],
            message: 'Invalid input: expected array, received undefined',
          }),
          expect.objectContaining({
            path: ['expiresAt'],
            message: 'Cannot expire in the past',
          }),
        ],
      }),
    );
  });
});
