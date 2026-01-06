import { auth, Session } from '@/lib/auth';
import { describe, expect, it, vi } from 'vitest';
import { getUser } from '../get-user';

describe('get-user', () => {
  it('should return an authenticated user', async () => {
    const mockUser = {
      id: '1',
    };

    const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user: mockUser,
    } as unknown as Session);

    const user = await getUser();
    expect(user).toBe(mockUser);
    expect(getSessionSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when not authenticated', async () => {
    await expect(getUser).rejects.toThrowError('Unauthorized');
  });
});
