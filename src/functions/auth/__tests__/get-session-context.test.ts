import { Game } from '@/db/types';
import { auth, Member, Organization, Session } from '@/lib/auth';
import { gameStore } from '@/stores/game-store';
import { faker } from '@faker-js/faker';
import { describe, expect, it, vi } from 'vitest';
import { getSessionContext } from '../get-session-context';

describe('get-session-context serverFn', () => {
  const mockUser = {
    id: faker.string.uuid(),
  };

  it('should return an authenticated user context', async () => {
    const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user: mockUser,
    } as unknown as Session);

    const mockOrganizations = [{ id: faker.string.uuid() }] as Organization[];

    const listOrganizationsSpy = vi
      .spyOn(auth.api, 'listOrganizations')
      .mockResolvedValue(mockOrganizations);

    const mockMembers = [{ user: mockUser, role: 'member' }] as Member[];

    const listMembersSpy = vi.spyOn(auth.api, 'listMembers').mockResolvedValue({
      members: mockMembers.map((m) => ({
        ...m,
        user: { ...m.user, image: '' },
      })),
      total: mockMembers.length,
    });

    const mockGames = [{ id: faker.number.int() }] as Game[];

    const findManyGamesSpy = vi
      .spyOn(gameStore, 'findMany')
      .mockResolvedValue(mockGames);

    const context = await getSessionContext();
    expect(context).toEqual({
      user: {
        ...mockUser,
        role: 'member',
      },
      organizations: mockOrganizations,
      activeOrganization: {
        ...mockOrganizations[0],
        games: mockGames,
        activeGame: null,
      },
    });

    expect(getSessionSpy).toHaveBeenCalledTimes(1);
    expect(listOrganizationsSpy).toHaveBeenCalledTimes(1);

    expect(listMembersSpy).toHaveBeenCalledTimes(1);
    expect(listMembersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        query: {
          organizationId: mockOrganizations[0]?.id,
          limit: 1,
          filterField: 'userId',
          filterOperator: 'eq',
          filterValue: mockUser.id,
        },
      }),
    );

    expect(findManyGamesSpy).toHaveBeenCalledTimes(1);
    expect(findManyGamesSpy).toHaveBeenCalledWith({
      where: {
        organizationId: mockOrganizations[0]?.id,
      },
    });
  });

  it('should set the active game based on the user settings', async () => {
    const mockUser = {
      id: faker.string.uuid(),
      settings: {
        activeGameId: faker.number.int(),
      },
    };

    vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user: mockUser,
    } as unknown as Session);

    const mockOrganizations = [{ id: faker.string.uuid() }] as Organization[];

    vi.spyOn(auth.api, 'listOrganizations').mockResolvedValue(
      mockOrganizations,
    );

    const mockMembers = [{ id: mockUser.id, role: 'member' }] as Member[];

    vi.spyOn(auth.api, 'listMembers').mockResolvedValue({
      members: mockMembers.map((m) => ({
        ...m,
        user: { ...m.user, image: '' },
      })),
      total: mockMembers.length,
    });

    const mockGames = [
      { id: faker.number.int() },
      { id: mockUser.settings.activeGameId },
    ] as Game[];

    vi.spyOn(gameStore, 'findMany').mockResolvedValue(mockGames);

    const context = await getSessionContext();
    expect(context).toEqual({
      user: {
        ...mockUser,
        role: 'member',
      },
      organizations: mockOrganizations,
      activeOrganization: {
        ...mockOrganizations[0],
        games: mockGames,
        activeGame: mockGames[1],
      },
    });
  });

  it('should throw an error when not authenticated', async () => {
    await expect(getSessionContext).rejects.toThrowError('Unauthorized');
  });

  it('should throw an error if there is no active organization', async () => {
    vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user: mockUser,
    } as Session);

    vi.spyOn(auth.api, 'listOrganizations').mockResolvedValue([]);

    await expect(getSessionContext).rejects.toThrowError(
      `No active organization found for user ${mockUser.id}`,
    );
  });
});
