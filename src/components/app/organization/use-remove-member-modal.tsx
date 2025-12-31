import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { modals } from '@/components/ui/modals';
import { Member, Organization } from '@/lib/auth';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/logger';
import { useRouter } from '@tanstack/react-router';

const modalId = 'remove-member-modal';

export function useRemoveMemberModal({
  organization,
}: {
  organization: Organization;
}) {
  const router = useRouter();
  const notify = useNotifications();

  const open = (member: Member) => {
    modals.openConfirmModal({
      modalId,
      title: <span className="font-bold">Remove Member</span>,
      children: (
        <p>
          Are you sure you wish to remove the member{' '}
          <strong>
            {member.user.name} ({member.user.email})
          </strong>{' '}
          from the organization <strong>{organization.name}</strong>?
        </p>
      ),
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      closeOnConfirm: false,
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        modals.updateModal({
          modalId,
          confirmProps: { color: 'red', loading: true },
        });

        try {
          await authClient.organization.removeMember({
            memberIdOrEmail: member.id,
            organizationId: organization.id,
          });
          modals.close(modalId);
          await router.invalidate();
          notify.success({
            title: 'Member removed',
            message: `${member.user.name} has been removed from the organization`,
          });
        } catch (err) {
          logger.error(err);
          notify.error({
            title: 'Failed to remove member',
            message: 'Something went wrong. Please try again.',
          });
        } finally {
          modals.updateModal({
            modalId,
            confirmProps: { color: 'red', loading: false },
          });
        }
      },
    });
  };

  return open;
}
