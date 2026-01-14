import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { updateUser } from '@/functions/user/update-user';
import { Organization } from '@/libs/auth';
import { authClient } from '@/libs/auth/client';

export interface UseLeaveOrganizationModalProps {
  organization: Organization;
}

export function useLeaveOrganizationModal({
  organization,
}: UseLeaveOrganizationModalProps) {
  const notify = useNotifications();
  const openAsyncConfirmModal = useOpenAsyncConfirmModal();

  return () =>
    openAsyncConfirmModal({
      title: 'Leave Organization',
      children: (
        <p>
          Are you sure you leave the organization{' '}
          <strong>{organization.name}</strong>?
        </p>
      ),
      confirmLabel: 'Leave',
      onConfirm: async () => {
        await updateUser({
          data: { activeOrganizationId: null },
        });
        await authClient.organization.leave({
          organizationId: organization.id,
        });
      },
      onSuccess: () => {
        notify.success({
          title: 'Left organization',
          message: `You are no longer a member of the organization.`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to leave organization',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
}
