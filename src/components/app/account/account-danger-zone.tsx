import { Button } from '@/components/ui/button';
import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { Title } from '@/components/ui/title';
import { deleteUser } from '@/lib/auth/client';
import { Trash2 } from 'lucide-react';

export function AccountDangerZone() {
  const openAsyncConfirmModel = useOpenAsyncConfirmModal();

  const openDeleteAccountConfirmModal = () =>
    openAsyncConfirmModel({
      title: 'Confirm Account Deletion',
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
      destructive: true,
      confirmLabel: 'Delete Account',
      onConfirm: async () => {
        await deleteUser({ callbackURL: '/?accountDeleted=true' });
      },
    });

  return (
    <div>
      <Title order={4}>Danger Zone</Title>

      <Button
        destructive
        onClick={openDeleteAccountConfirmModal}
        className="mt-2"
        leftSection={<Trash2 />}
      >
        Delete Account
      </Button>
    </div>
  );
}
