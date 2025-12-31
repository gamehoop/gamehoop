import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { modals } from '@/components/ui/modals';
import { updateUser } from '@/functions/user/update-user';
import { Organization } from '@/lib/auth';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/logger';
import { useRouter } from '@tanstack/react-router';

const modalId = 'leave-organization-modal';

export function useLeaveOrganizationModal({
  organization,
}: {
  organization: Organization;
}) {
  const router = useRouter();
  const notify = useNotifications();

  const open = () => {
    modals.openConfirmModal({
      modalId,
      title: <span className="font-bold">Leave Organization</span>,
      children: (
        <p>
          Are you sure you leave the organization{' '}
          <strong>{organization.name}</strong>?
        </p>
      ),
      labels: { confirm: 'Leave', cancel: 'Cancel' },
      closeOnConfirm: false,
      onConfirm: async () => {
        modals.updateModal({
          modalId,
          confirmProps: { loading: true },
        });

        try {
          await updateUser({
            data: { activeOrganizationId: null },
          });
          await authClient.organization.leave({
            organizationId: organization.id,
          });
          modals.close(modalId);
          await router.invalidate();
          notify.success({
            title: 'Left organization',
            message: `You are no longer a member of the organization.`,
          });
        } catch (err) {
          logger.error(err);
          notify.error({
            title: 'Failed to leave organization',
            message: 'Something went wrong. Please try again.',
          });
        } finally {
          modals.updateModal({
            modalId,
            confirmProps: { loading: false },
          });
        }
      },
    });
  };

  return open;
}
