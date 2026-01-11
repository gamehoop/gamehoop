import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select } from '@/components/ui/select';
import { TextInput } from '@/components/ui/text-input';
import {
  gameGenreOptions,
  gamePlatformOptions,
  gameSdkOptions,
} from '@/domain/game';
import { createGame } from '@/functions/game/create-game';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import z from 'zod';

export function useCreateGameModal() {
  const router = useRouter();
  const notify = useNotifications();
  const openAsyncConfirmModel = useOpenAsyncConfirmModal();

  const formSchema = z.object({
    name: z.string().min(1),
    genre: z.string().optional(),
    platforms: z.array(z.string()).optional(),
    sdk: z.string().optional(),
  });

  const defaultValues: z.input<typeof formSchema> = {
    name: '',
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await createGame({ data: value });
    },
  });

  return () => {
    return openAsyncConfirmModel({
      title: 'Create Game',
      children: (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
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

          <form.Field name="genre">
            {(field) => (
              <Select
                label="Genre"
                data={gameGenreOptions}
                name={field.name}
                value={field.state.value}
                onChange={(value) => value && field.handleChange(value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
              />
            )}
          </form.Field>

          <form.Field name="platforms">
            {(field) => (
              <MultiSelect
                label="Platforms"
                data={gamePlatformOptions}
                name={field.name}
                value={field.state.value}
                onChange={(value) => value && field.handleChange(value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
              />
            )}
          </form.Field>

          <form.Field name="sdk">
            {(field) => (
              <Select
                label="SDK"
                data={gameSdkOptions}
                name={field.name}
                value={field.state.value}
                onChange={(value) => value && field.handleChange(value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
              />
            )}
          </form.Field>
        </form>
      ),
      size: 'md',
      confirmLabel: 'Create',
      validate: async () => {
        await form.validate('submit');
        return form.state.isValid;
      },
      onClose: () => form.reset(),
      onConfirm: () => form.handleSubmit(),
      onSuccess: async () => {
        await router.navigate({ to: '/games' });
      },
      onError: () => {
        notify.error({
          title: 'Failed to create game',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
  };
}
