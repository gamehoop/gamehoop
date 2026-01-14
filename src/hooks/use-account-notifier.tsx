import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { User } from '@/libs/auth';
import { useLocation } from '@tanstack/react-router';
import { Mail } from 'lucide-react';
import { useEffect } from 'react';

export interface UseAccountNotifierProps {
  user?: User;
}

export function useAccountNotifier({ user }: UseAccountNotifierProps) {
  const notify = useNotifications();
  const location = useLocation();

  useEffect(() => {
    if (location.search.error) {
      notify.error({
        title: 'Something went wrong',
        message: location.search.error,
      });
    }

    if (user && !user.emailVerified) {
      notify.warning({
        title: 'Verify your email address',
        message: 'Please check your inbox and verify your email address.',
        id: 'verify-email-notification',
        autoClose: false,
        icon: <Mail />,
      });
    }

    const { verified, invitationAccepted, accountDeleted } = location.search;
    if (verified) {
      notify.success({
        id: 'email-address-verified',
        title: 'Email address verified',
        message: 'Thank you for verifying your email address.',
      });
    }

    if (location.pathname === '/' && invitationAccepted) {
      notify.success({
        id: 'invitation-accepted',
        title: 'Invitation accepted',
        message: 'You have successfully joined the organization.',
      });
    }

    if (accountDeleted) {
      notify.success({
        id: 'account-deleted',
        title: 'Sorry to see you go',
        message: 'Your account has been permanently deleted.',
      });
    }
  }, [user, notify, location]);
}
