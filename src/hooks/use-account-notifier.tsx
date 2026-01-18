import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { User } from '@/libs/auth';
import { sendVerificationEmail } from '@/libs/auth/client';
import { useLocation } from '@tanstack/react-router';
import { Mail } from 'lucide-react';
import { useCallback, useEffect } from 'react';

export interface UseAccountNotifierProps {
  user?: User;
}

export function useAccountNotifier({ user }: UseAccountNotifierProps) {
  const notify = useNotifications();
  const location = useLocation();

  const onResendVerificationEmail = useCallback(async () => {
    if (!user) {
      return;
    }

    await sendVerificationEmail({ email: user.email });
  }, [user]);

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
        message: (
          <div className="flex">
            <div className="w-4/5">
              Please check your inbox and verify your email address.
            </div>
            <Button
              variant="subtle"
              size="xs"
              onClick={onResendVerificationEmail}
            >
              Resend
            </Button>
          </div>
        ),
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
  }, [user, notify, location, onResendVerificationEmail]);
}
