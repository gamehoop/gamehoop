import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { NumberInput } from '@/components/ui/number-input';
import { Switch } from '@/components/ui/switch';
import { TextInput } from '@/components/ui/text-input';
import { Game } from '@/db/types';
import { updateGame } from '@/functions/game/update-game';
import { logError } from '@/lib/logger';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import z from 'zod';

export interface GameAuthenticationSettingsFormProps {
  game: Game;
}

export function GameAuthenticationSettingsForm({
  game,
}: GameAuthenticationSettingsFormProps) {
  const router = useRouter();
  const notify = useNotifications();

  const zOnSubmit = z.object({
    requireEmailVerification: z.boolean(),
    minPasswordLength: z.int().min(8).max(128),
    sessionExpiresInDays: z.int().min(1),
    senderName: z.string().min(1),
    replyToEmail: z.email().optional(),
  });

  const defaultValues: z.infer<typeof zOnSubmit> = {
    requireEmailVerification:
      game.settings?.auth?.requireEmailVerification ?? false,
    minPasswordLength: game.settings?.auth?.minPasswordLength ?? 8,
    sessionExpiresInDays: game.settings?.auth?.sessionExpiresInDays ?? 7,
    senderName: game.settings?.auth?.senderName ?? game.name,
    replyToEmail: game.settings?.auth?.replyToEmail ?? undefined,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: zOnSubmit,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateGame({
          data: {
            gameId: game.id,
            settings: {
              auth: {
                ...value,
              },
            },
          },
        });
        await router.invalidate();
        form.reset(value);
        notify.success({
          title: 'Account updated',
          message: 'Your changes have been saved.',
        });
      } catch (error) {
        logError(error);
        notify.error({
          title: 'Failed to update account',
          message: 'Something went wrong. Please try again.',
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 max-w-125"
    >
      <form.Field name="requireEmailVerification">
        {(field) => (
          <Switch
            name={field.name}
            label="Require Email Verification"
            checked={field.state.value}
            onChange={(e) => field.handleChange(e.target.checked)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>

      <form.Field name="senderName">
        {(field) => (
          <TextInput
            label="Sender Name"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
            description={`Players will receive an email from "${field.state.value} via Gamehoop"`}
            required
          />
        )}
      </form.Field>

      <form.Field name="replyToEmail">
        {(field) => (
          <TextInput
            type="email"
            label="Reply To Email"
            name={field.name}
            value={field.state.value ?? ''}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : e.target.value;
              field.handleChange(value);
            }}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
            description={`Any email responses from players will be sent here`}
          />
        )}
      </form.Field>

      <form.Field name="minPasswordLength">
        {(field) => (
          <NumberInput
            name={field.name}
            label="Minimum Password Length"
            value={field.state.value}
            onChange={(value) => field.handleChange(Number(value))}
            allowDecimal={false}
            min={8}
            max={128}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
            required
          />
        )}
      </form.Field>

      <form.Field name="sessionExpiresInDays">
        {(field) => (
          <NumberInput
            name={field.name}
            label="Session Expiration (Days)"
            value={field.state.value}
            onChange={(value) => field.handleChange(Number(value))}
            allowDecimal={false}
            min={1}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
            required
          />
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [
          state.isDirty,
          state.canSubmit,
          state.isSubmitting,
        ]}
      >
        {([isDirty, canSubmit, isSubmitting]) => (
          <span>
            <Button
              onClick={() => form.handleSubmit()}
              disabled={!isDirty || !canSubmit || isSubmitting}
              leftSection={<Save />}
              loading={isSubmitting}
            >
              Save Changes
            </Button>
          </span>
        )}
      </form.Subscribe>
    </form>
  );
}
