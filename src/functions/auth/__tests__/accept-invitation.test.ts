import { auth, Invitation, Member } from '@/lib/auth';
import { faker } from '@faker-js/faker';
import { describe, expect, it, vi } from 'vitest';
import { acceptInvitation } from '../accept-invitation';

describe('accept-invitation serverFn', () => {
  it('should accept a valid invitation', async () => {
    const acceptInvitationSpy = vi
      .spyOn(auth.api, 'acceptInvitation')
      .mockResolvedValue({
        invitation: {} as Invitation,
        member: {} as Member,
      });

    const invitationId = faker.string.uuid();
    const res = await acceptInvitation({ data: { invitationId } });
    expect(res).toBeUndefined();

    expect(acceptInvitationSpy).toHaveBeenCalledTimes(1);
    expect(acceptInvitationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          invitationId,
        },
      }),
    );
  });

  it('should reject an invalid invitation', async () => {
    const mockError = new Error('Invalid invitation');
    vi.spyOn(auth.api, 'acceptInvitation').mockRejectedValue(mockError);

    await expect(
      acceptInvitation({ data: { invitationId: faker.string.uuid() } }),
    ).rejects.toThrow(mockError);
  });

  it('should validate the body', async () => {
    await expect(
      acceptInvitation({ data: { invitationId: '' } }),
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'ZodError',
        issues: [
          expect.objectContaining({
            path: ['invitationId'],
            message: 'Too small: expected string to have >=1 characters',
          }),
        ],
      }),
    );
  });
});
