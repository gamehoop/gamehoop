import { auth } from '@/lib/auth';
import { HttpStatus } from '@/utils/http';
import { redirect } from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';
import { signOut } from '../sign-out';

describe('sign-out', () => {
  it('should sign out the user and redirect to the sign in route', async () => {
    const signOutSpy = vi.spyOn(auth.api, 'signOut');
    await expect(signOut).rejects.toThrowError(
      expect.objectContaining({
        options: { to: '/sign-in', statusCode: HttpStatus.TemporaryRedirect },
      }),
    );

    expect(signOutSpy).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalled();
  });
});
