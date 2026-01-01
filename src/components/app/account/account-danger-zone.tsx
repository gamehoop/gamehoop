import { Button } from '@/components/ui/button';
import { modals } from '@/components/ui/modals';
import { Title } from '@/components/ui/title';
import { deleteUser } from '@/lib/auth/client';
import { Trash2 } from 'lucide-react';

const modalId = 'delete-account-modal';

export function AccountDangerZone() {
  const openModal = () =>
    modals.openConfirmModal({
      modalId,
      title: <span className="font-bold">Confirm Account Deletion</span>,
      children: (
        <>
          <p>
            Are you sure you want to delete your account? This action is
            irreversible.
          </p>

          <p className="mt-2">
            You will receive an email with a link to delete your account.
          </p>
        </>
      ),
      labels: { confirm: 'Delete Account', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      closeOnConfirm: false,
      onConfirm: async () => {
        modals.updateModal({
          modalId,
          confirmProps: { color: 'red', loading: true },
        });

        await deleteUser({ callbackURL: '/?accountDeleted=true' });

        modals.close(modalId);
      },
    });

  return (
    <div>
      <Title order={4}>Danger Zone</Title>

      <Button
        destructive
        onClick={openModal}
        className="mt-2"
        leftSection={<Trash2 />}
      >
        Delete Account
      </Button>
    </div>
  );
}
