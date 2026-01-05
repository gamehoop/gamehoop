import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { TextInput } from '@/components/ui/text-input';
import { deleteActiveOrganizationLogo } from '@/functions/organization/delete-active-organization-logo';
import { updateActiveOrganizationLogo } from '@/functions/organization/update-active-organization-logo';
import { useSessionContext } from '@/hooks/use-session-context';
import { Organization } from '@/lib/auth';
import { authClient } from '@/lib/auth/client';
import { logError } from '@/lib/logger';
import { cn } from '@/utils/styles';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { Castle, Save } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import z from 'zod';

export interface OrganizationSettingsFormProps {
  organization: Organization;
}

export function OrganizationSettingsForm({
  organization,
}: OrganizationSettingsFormProps) {
  const { user } = useSessionContext();
  const router = useRouter();
  const notify = useNotifications();
  const logoInput = useRef<HTMLInputElement>(null);

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
        await router.invalidate();
        form.reset(value);
        notify.success({
          title: 'Organization updated',
          message: 'Your changes have been saved.',
        });
      } catch (error) {
        logError(error);
        notify.error({
          title: 'Failed to update organization',
          message: 'Something went wrong. Please try again.',
        });
      }
    },
  });

  const onLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const maxFileSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxFileSizeBytes) {
      notify.error({
        title: 'Logo file too large',
        message: 'Please select a file smaller than 2MB.',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      notify.error({
        title: 'Invalid file type',
        message: `Supported file types are png, jpg, jpeg, gif, and webp.`,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('logo', file);
      await updateActiveOrganizationLogo({ data: formData });
      await router.invalidate();
      notify.success({
        title: 'Logo updated',
        message: 'Your new logo has been uploaded.',
      });
    } catch (error) {
      logError(error);
      notify.error({
        title: 'Failed to update logo',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  const onDeleteLogo = async () => {
    try {
      await deleteActiveOrganizationLogo();
      await router.invalidate();
      notify.success({
        title: 'Logo deleted',
        message: 'The logo has been removed.',
      });
    } catch (error) {
      logError(error);
      notify.error({
        title: 'Failed to delete logo',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 max-w-125"
    >
      <div className="flex gap-2 items-center mt-2">
        <input
          ref={logoInput}
          type="file"
          className="hidden"
          onChange={onLogoChange}
        />
        <Avatar
          onClick={() => {
            if (user.role !== 'member') {
              logoInput.current?.click();
            }
          }}
          src={
            organization.logo ? `/api/organization/${organization.id}/logo` : ''
          }
          className={cn(user.role !== 'member', 'cursor-pointer')}
          size="xl"
        >
          <Castle />
        </Avatar>
        {organization.logo && (
          <Button variant="subtle" size="sm" onClick={onDeleteLogo}>
            Delete Logo
          </Button>
        )}
      </div>

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
            disabled={user.role === 'member'}
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
