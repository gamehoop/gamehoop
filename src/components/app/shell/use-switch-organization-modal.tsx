import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { modals } from '@/components/ui/modals';
import { Select } from '@/components/ui/select';
import { updateUser } from '@/functions/user/update-user';
import { Organization, User } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import z from 'zod';

const modalId = 'switch-organization-modal';

export function useSwitchOrganizationModal({
  user,
  organizations,
}: {
  user: User;
  organizations: Organization[];
}) {
  const router = useRouter();
  const notify = useNotifications();

  const form = useForm({
    defaultValues: {
      organizationId:
        user.settings?.activeOrganizationId ?? organizations[0]?.id,
    },
    validators: {
      onSubmit: z.object({
        organizationId: z.string().min(1),
      }),
    },
    onSubmit: async ({ value }) => {
      modals.updateModal({
        modalId,
        confirmProps: { loading: true },
      });

      try {
        await updateUser({
          data: {
            activeOrganizationId: value.organizationId,
          },
        });
        modals.close(modalId);
        form.reset(value);
        await router.invalidate();

        const organization = organizations.find(
          (o) => o.id === value.organizationId,
        );
        notify.success({
          title: 'Organization switched',
          message: `Now viewing ${organization?.name}`,
        });
      } catch (err) {
        logger.error(err);
        notify.error({
          title: 'Failed to switch organization',
          message: 'Something went wrong. Please try again.',
        });
      } finally {
        modals.updateModal({
          modalId,
          confirmProps: { loading: false },
        });
      }
    },
  });

  const open = () => {
    modals.openConfirmModal({
      modalId,
      size: 'md',
      title: <span className="font-bold">Switch Organization</span>,
      children: (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          <form.Field name="organizationId">
            {(field) => (
              <Select
                label="Organization"
                data={organizations.map((org) => ({
                  value: org.id,
                  label: org.name,
                }))}
                name={field.name}
                value={field.state.value}
                onChange={(value) => value && field.handleChange(value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>
        </form>
      ),
      labels: { confirm: 'Switch', cancel: 'Cancel' },
      closeOnConfirm: false,
      onConfirm: () => form.handleSubmit(),
    });
  };

  return open;
}
