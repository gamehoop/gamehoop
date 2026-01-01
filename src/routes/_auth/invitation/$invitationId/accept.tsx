import { acceptInvitation } from '@/functions/auth/accept-invitation';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/invitation/$invitationId/accept')({
  beforeLoad: async ({
    context: { user },
    params: { invitationId },
    location,
  }) => {
    if (user) {
      await acceptInvitation({ data: { invitationId } });
      throw redirect({
        to: '/',
        search: { invitationAccepted: true },
      });
    } else {
      throw redirect({
        to: '/sign-up',
        search: { redirect: location.href },
      });
    }
  },
});
