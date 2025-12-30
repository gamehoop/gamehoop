import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { TextInput } from '@/components/ui/text-input';
import { Organization } from '@/lib/auth';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/logger';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { Castle, Save } from 'lucide-react';
import z from 'zod';

export interface OrganizationSettingsFormProps {
  organization: Organization;
}

export function OrganizationSettingsForm({
  organization,
}: OrganizationSettingsFormProps) {
  const router = useRouter();
  const notify = useNotifications();

  const form = useForm({
    defaultValues: {
      name: organization.name,
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await authClient.organization.update({
          organizationId: organization.id,
          data: value,
        });
        form.reset(value);
        await router.invalidate();
        notify.success({
          title: 'Organization updated',
          message: 'Your changes have been saved.',
        });
      } catch (err) {
        logger.error(err);
        notify.error({
          title: 'Failed to update organization',
          message: 'Something went wrong. Please try again.',
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 max-w-[500px]"
    >
      <form.Field name="name">
        {(field) => (
          <TextInput
            label="Name"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            leftSection={<Castle />}
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
