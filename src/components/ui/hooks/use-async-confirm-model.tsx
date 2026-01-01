import { modals } from '@/components/ui/modals';
import { logger } from '@/lib/logger';
import { useRouter } from '@tanstack/react-router';
import { PropsWithChildren, ReactNode, useId } from 'react';
import { UISize } from '..';

export interface OpenAsyncConfirmModalProps extends PropsWithChildren {
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => Promise<void>;
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
    onConfirm,
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
      onConfirm: async () => {
        try {
          modals.updateModal({
            modalId,
            confirmProps: { color, loading: true },
          });
          await onConfirm();
          modals.close(modalId);
          await router.invalidate();
          onSuccess?.();
        } catch (err) {
          logger.error(err);
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
