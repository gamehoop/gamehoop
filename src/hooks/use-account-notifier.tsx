import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { User } from '@/lib/auth';
import { Mail } from 'lucide-react';
import { useEffect } from 'react';

export function useAccountNotifier({ user }: { user?: User }) {
  const notify = useNotifications();

  useEffect(() => {
    if (user && !user.emailVerified) {
      notify.warning({
        title: 'Verify your email address',
        message: 'Please check your inbox and verify your email address.',
        id: 'verify-email-notification',
        autoClose: false,
        icon: <Mail />,
      });
    }
  }, [user, notify]);
}
