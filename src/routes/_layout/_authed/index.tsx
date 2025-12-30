import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import z from 'zod';

export const Route = createFileRoute('/_layout/_authed/')({
  validateSearch: z.object({
    verified: z.boolean().optional(),
  }),
  component: Home,
});

function Home() {
  const { verified } = Route.useSearch();
  const notify = useNotifications();

  useEffect(() => {
    if (verified) {
      notify.success({
        title: 'Email address verified',
        message: 'Thank you for verifying your email address.',
      });
    }
  }, [verified, notify]);

  return <div></div>;
}
