import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Select } from '@/components/ui/select';
import { useSessionContext } from '@/hooks/use-session-context';
import { updateUser } from '@/lib/auth/client';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { Gamepad2 } from 'lucide-react';
import z from 'zod';

export function useSwitchGameModal() {
  const {
    user,
    activeOrganization: { games, activeGame },
  } = useSessionContext();
  const router = useRouter();
  const notify = useNotifications();
  const openAsyncConfirmModal = useOpenAsyncConfirmModal();

  const form = useForm({
    defaultValues: {
      gameId: activeGame?.id,
    },
    validators: {
      onSubmit: z.object({
        gameId: z.int(),
      }),
    },
    onSubmit: async ({ value }) => {
      await updateUser({
        settings: {
          ...user.settings,
          activeGameId: value.gameId,
        },
      });
    },
  });

  return () => {
    openAsyncConfirmModal({
      title: 'Switch Game',
      children: (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          <form.Field name="gameId">
            {(field) => (
              <Select
                label="Game"
                data={games.map((game) => ({
                  value: game.id.toString(),
                  label: game.name,
                }))}
                leftSection={<Gamepad2 />}
                name={field.name}
                value={field.state.value?.toString()}
                onChange={(value) =>
                  value && field.handleChange(parseInt(value, 10))
                }
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>
        </form>
      ),
      confirmLabel: 'Switch',
      size: 'md',
      validate: async () => {
        await form.validate('submit');
        return form.state.isValid;
      },
      onConfirm: () => form.handleSubmit(),
      onClose: () => form.reset(),
      onSuccess: async () => {
        const game = games.find(
          (game) => game.id === form.getFieldValue('gameId'),
        );
        form.reset({ gameId: game?.id });
        await router.navigate({ to: '/' });
      },
      onError: () => {
        notify.error({
          title: 'Failed to switch game',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
  };
}
