import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Select } from '@/components/ui/select';
import { updateUser } from '@/functions/user/update-user';
import { useSessionContext } from '@/hooks/use-session-context';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

export function useSwitchOrganizationModal() {
  const { organizations, activeOrganization } = useSessionContext();
  const notify = useNotifications();
  const openAsyncConfirmModal = useOpenAsyncConfirmModal();

  const form = useForm({
    defaultValues: {
      organizationId: activeOrganization.id,
    },
    validators: {
      onSubmit: z.object({
        organizationId: z.string().min(1),
      }),
    },
    onSubmit: async ({ value }) => {
      await updateUser({
        data: {
          activeOrganizationId: value.organizationId,
        },
      });
      form.reset(value);
    },
  });

  return () => {
    openAsyncConfirmModal({
      title: 'Switch Organization',
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
      confirmLabel: 'Switch',
      size: 'md',
      onConfirm: () => form.handleSubmit(),
      onSuccess: () => {
        const organization = organizations.find(
          (o) => o.id === form.getFieldValue('organizationId'),
        );
        notify.success({
          title: 'Organization switched',
          message: `Now viewing ${organization?.name}`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to switch organization',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
  };
}
