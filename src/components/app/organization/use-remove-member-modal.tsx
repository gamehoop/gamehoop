import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Member, Organization } from '@/libs/auth';
import { authClient } from '@/libs/auth/client';

export interface UseRemoveMemberModalProps {
  organization: Organization;
}

export function useRemoveMemberModal({
  organization,
}: UseRemoveMemberModalProps) {
  const notify = useNotifications();
  const openAsyncConfirmModel = useOpenAsyncConfirmModal();

  return (member: Member) => {
    return openAsyncConfirmModel({
      title: 'Remove Member',
      children: (
        <p>
          Are you sure you wish to remove the member{' '}
          <strong>
            {member.user.name} ({member.user.email})
          </strong>{' '}
          from the organization <strong>{organization.name}</strong>?
        </p>
      ),
      confirmLabel: 'Remove',
      destructive: true,
      onConfirm: async () => {
        await authClient.organization.removeMember({
          memberIdOrEmail: member.id,
          organizationId: organization.id,
        });
      },
      onSuccess: () => {
        notify.success({
          title: 'Member removed',
          message: `${member.user.name} has been removed from the organization`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to remove member',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
  };
}
