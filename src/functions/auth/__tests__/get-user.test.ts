import { auth, Session } from '@/lib/auth';
import { faker } from '@faker-js/faker';
import { describe, expect, it, vi } from 'vitest';
import { getUser } from '../get-user';

describe('get-user serverFn', () => {
  it('should return an authenticated user', async () => {
    const mockUser = { id: faker.string.uuid() };

    const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user: mockUser,
    } as Session);

    const user = await getUser();
    expect(user).toBe(mockUser);

    expect(getSessionSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when not authenticated', async () => {
    await expect(getUser).rejects.toThrowError('Unauthorized');
  });
});
