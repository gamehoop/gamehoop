import { acceptInvitation } from '@/functions/auth/accept-invitation';
import { logError } from '@/libs/logger';
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
      try {
        await acceptInvitation({ data: { invitationId } });
      } catch (error) {
        logError(error);
        throw redirect({
          to: '/',
          search: {
            error:
              error instanceof Error
                ? error.message
                : 'Failed to accept invitation',
          },
        });
      }

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
