import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import z from 'zod';

export const Route = createFileRoute('/_layout/_authed/')({
  validateSearch: z.object({
    verified: z.boolean().optional(),
    accountDeleted: z.boolean().optional(),
    invitationAccepted: z.boolean().optional(),
  }),
  component: Home,
});

function Home() {
  const { verified, accountDeleted, invitationAccepted } = Route.useSearch();
  const notify = useNotifications();

  useEffect(() => {
    if (verified) {
      notify.success({
        title: 'Email address verified',
        message: 'Thank you for verifying your email address.',
      });
    }
  }, [verified, notify]);

  useEffect(() => {
    if (accountDeleted) {
      notify.success({
        title: 'Sorry to see you go',
        message: 'Your account has been permanently deleted.',
      });
    }
  }, [accountDeleted, notify]);

  useEffect(() => {
    if (invitationAccepted) {
      notify.success({
        title: 'Invitation accepted',
        message: 'You have successfully joined the organization.',
      });
    }
  }, [invitationAccepted, notify]);

  return <div></div>;
}
