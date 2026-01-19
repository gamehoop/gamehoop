import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { TextInput } from '@/components/ui/text-input';
import { Game, Player } from '@/db/types';
import { updatePlayer } from '@/functions/game/players/update-player';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

export interface UseUpdatePlayerModalProps {
  game: Game;
  player: Player;
}

export function useUpdatePlayerModal({
  game,
  player,
}: UseUpdatePlayerModalProps) {
  const notify = useNotifications();
  const openAsyncConfirmModel = useOpenAsyncConfirmModal();

  const form = useForm({
    defaultValues: {
      name: player.name,
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1),
      }),
    },
    onSubmit: async ({ value }) => {
      await updatePlayer({
        data: { gameId: game.id, playerId: player.id, ...value },
      });
    },
  });

  return () => {
    return openAsyncConfirmModel({
      title: `Edit ${player.name}`,
      children: (
        <form.Field name="name">
          {(field) => (
            <TextInput
              label="Name"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.message}
              required
            />
          )}
        </form.Field>
      ),
      size: 'md',
      validate: async () => {
        await form.validate('submit');
        return form.state.isValid;
      },
      onConfirm: () => form.handleSubmit(),
      onClose: () => form.reset(),
      onSuccess: () => {
        notify.success({
          title: 'Player updated',
          message: `${player.name} has been updated`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to update player',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
  };
}
