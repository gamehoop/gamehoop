import { Game } from '@/db/types';
import { auth, Member, Organization, Session } from '@/lib/auth';
import { gameStore } from '@/stores/game-store';
import { describe, expect, it, vi } from 'vitest';
import { getSessionContext } from '../get-session-context';

describe('get-session-context', () => {
  it('should return an authenticated user context', async () => {
    const mockUser = {
      id: '1',
    };

    const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user: mockUser,
    } as unknown as Session);

    const mockOrganizations = [{ id: '1' }] as Organization[];

    const listOrganizationsSpy = vi
      .spyOn(auth.api, 'listOrganizations')
      .mockResolvedValue(mockOrganizations);

    const mockMembers = [{ ...mockUser, role: 'member' }] as Member[];

    const listMembersSpy = vi.spyOn(auth.api, 'listMembers').mockResolvedValue({
      members: mockMembers as any,
      total: mockMembers.length,
    });

    const mockGames = [{ id: 1 }] as Game[];

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

  it('should throw an error when not authenticated', async () => {
    await expect(getSessionContext).rejects.toThrowError('Unauthorized');
  });

  it('should throw an error if there is no active organization', async () => {
    const mockUser = {
      id: '1',
    };

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
