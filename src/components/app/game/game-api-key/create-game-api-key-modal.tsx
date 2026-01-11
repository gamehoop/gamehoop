import { ActionIcon } from '@/components/ui/action-icon';
import { DatePickerInput } from '@/components/ui/date-picker-input';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { modals } from '@/components/ui/modals';
import { MultiSelect } from '@/components/ui/multi-select';
import { TextInput } from '@/components/ui/text-input';
import { Game } from '@/db/types';
import { Scope, scopeOptions } from '@/domain/game-api-key';
import { createGameApiKey } from '@/functions/game/game-api-key/create-game-api-key';
import { logError } from '@/lib/logger';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { Copy } from 'lucide-react';
import z from 'zod';

const modalId = 'create-game-api-key-modal';

export interface UseCreateGameApiKeyModalProps {
  game: Game;
}

export function useCreateGameApiKeyModal({
  game,
}: UseCreateGameApiKeyModalProps) {
  const router = useRouter();
  const notify = useNotifications();

  const formSchema = z.object({
    scopes: z.array(z.string()).min(1),
    expiresAt: z
      .string()
      .optional()
      .refine(
        (val) => {
          return !val || new Date(val) > new Date();
        },
        { error: 'Cannot expire in the past' },
      ),
    description: z.string().min(1),
  });

  const defaultValues: z.input<typeof formSchema> = {
    scopes: [Scope.All],
    description: '',
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        modals.updateModal({
          modalId,
          confirmProps: { loading: true },
        });
        const result = await createGameApiKey({
          data: { ...value, gamePublicId: game.publicId },
        });
        modals.updateModal({
          modalId,
          children: (
            <>
              <TextInput
                name="apiKey"
                value={result.apiKey}
                description="This is your only chance to copy the API key!"
                rightSection={
                  <ActionIcon
                    variant="transparent"
                    onClick={async () => {
                      await window.navigator.clipboard.writeText(result.apiKey);
                    }}
                  >
                    <Copy />
                  </ActionIcon>
                }
                readOnly
              />
            </>
          ),
          cancelProps: {
            hidden: true,
          },
          confirmProps: {
            loading: false,
            hidden: true,
          },
        });
        await router.invalidate();
      } catch (error) {
        logError(error);
        modals.updateModal({
          modalId,
          confirmProps: {
            loading: false,
          },
        });
        notify.error({
          title: 'Failed to create API key',
          message: 'Something went wrong. Please try again.',
        });
      }
    },
  });

  return () => {
    return modals.openConfirmModal({
      modalId,
      title: <span className="font-bold">Create API Key</span>,
      labels: { confirm: 'Create', cancel: 'Cancel' },
      closeOnConfirm: false,
      children: (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          <form.Field name="description">
            {(field) => (
              <TextInput
                label="Description"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          <form.Field name="scopes">
            {(field) => (
              <MultiSelect
                label="Scopes"
                data={scopeOptions}
                name={field.name}
                value={field.state.value}
                onChange={(value) => value && field.handleChange(value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          <form.Field name="expiresAt">
            {(field) => (
              <DatePickerInput
                clearable
                label="Expires At"
                name={field.name}
                date={field.state.value}
                onChange={(val) => {
                  field.handleChange(val ?? undefined);
                }}
                error={field.state.meta.errors[0]?.message}
                presets={[
                  {
                    value: null,
                    label: 'Never',
                  },
                  {
                    value: dayjs().add(30, 'day').format('YYYY-MM-DD'),
                    label: '30 days',
                  },
                  {
                    value: dayjs().add(90, 'day').format('YYYY-MM-DD'),
                    label: '90 days',
                  },
                  {
                    value: dayjs().add(1, 'year').format('YYYY-MM-DD'),
                    label: 'One year',
                  },
                ]}
              />
            )}
          </form.Field>
        </form>
      ),
      size: 'md',
      onClose: () => form.reset(),
      onConfirm: async () => {
        await form.validate('submit');
        if (form.state.isValid) {
          await form.handleSubmit();
        }
      },
    });
  };
}
