import { auth, Invitation, Member } from '@/lib/auth';
import { describe, expect, it, vi } from 'vitest';
import { acceptInvitation } from '../accept-invitation';

describe('accept-invitation', () => {
  it('should accept an invitation', async () => {
    const acceptInvitationSpy = vi
      .spyOn(auth.api, 'acceptInvitation')
      .mockResolvedValue({
        invitation: {} as Invitation,
        member: {} as Member,
      });

    const invitationId = '1';
    await acceptInvitation({ data: { invitationId } });

    expect(acceptInvitationSpy).toHaveBeenCalledTimes(1);
    expect(acceptInvitationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          invitationId,
        },
      }),
    );
  });
});
