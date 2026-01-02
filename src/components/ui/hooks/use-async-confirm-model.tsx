import { modals } from '@/components/ui/modals';
import { logError } from '@/lib/logger';
import { useRouter } from '@tanstack/react-router';
import { PropsWithChildren, ReactNode, useId } from 'react';
import { UISize } from '..';

export interface OpenAsyncConfirmModalProps extends PropsWithChildren {
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  validate?: () => Promise<boolean>;
  onConfirm: () => Promise<void>;
  onClose?: () => void;
  onError?: () => void;
  onSuccess?: () => void;
  size?: UISize;
  title: string | ReactNode;
}

export function useOpenAsyncConfirmModal() {
  const router = useRouter();
  const modalId = useId();

  return ({
    cancelLabel = 'Cancel',
    children,
    confirmLabel = 'Confirm',
    destructive,
    validate,
    onConfirm,
    onClose,
    onError,
    onSuccess,
    size,
    title,
  }: OpenAsyncConfirmModalProps) => {
    const color = destructive ? 'red' : undefined;
    modals.openConfirmModal({
      modalId,
      size,
      title: <span className="font-bold">{title}</span>,
      children,
      labels: { confirm: confirmLabel, cancel: cancelLabel },
      confirmProps: { color },
      closeOnConfirm: false,
      onClose,
      onConfirm: async () => {
        try {
          modals.updateModal({
            modalId,
            confirmProps: { color, loading: true },
          });
          const isValid = !validate || (await validate());
          if (!isValid) {
            return;
          }
          await onConfirm();
          modals.close(modalId);
          await router.invalidate();
          onSuccess?.();
        } catch (error) {
          logError(error);
          onError?.();
        } finally {
          modals.updateModal({
            modalId,
            confirmProps: { color, loading: false },
          });
        }
      },
    });
  };
}
