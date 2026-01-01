import { acceptInvitation } from '@/functions/auth/accept-invitation';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/_auth/invitation/$invitationId/accept')({
  validateSearch: z.object({
    email: z.string().optional().catch(''),
  }),
  beforeLoad: async ({
    context: { user },
    params: { invitationId },
    search: { email },
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
        search: { email, redirect: location.href },
      });
    }
  },
});
