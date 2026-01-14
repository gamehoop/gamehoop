import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Select } from '@/components/ui/select';
import { Member, Organization } from '@/libs/auth';
import { authClient } from '@/libs/auth/client';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

export interface UseUpdateMemberModalProps {
  organization: Organization;
}

export function useUpdateMemberModal({
  organization,
}: UseUpdateMemberModalProps) {
  const notify = useNotifications();
  const openAsyncConfirmModel = useOpenAsyncConfirmModal();

  const form = useForm({
    defaultValues: {
      memberId: '',
      role: 'member',
    },
    validators: {
      onSubmit: z.object({
        memberId: z.string().min(1),
        role: z.enum(['admin', 'member']),
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.organization.updateMemberRole({
        memberId: value.memberId,
        organizationId: organization.id,
        role: value.role,
      });
    },
  });

  return (member: Member) => {
    form.reset({
      memberId: member.id,
      role: member.role,
    });

    return openAsyncConfirmModel({
      title: 'Update Member',
      children: (
        <form.Field name="role">
          {(field) => (
            <Select
              label="Role"
              data={[
                {
                  value: 'admin',
                  label: 'Admin',
                  description: 'Full control over the organization',
                },
                {
                  value: 'member',
                  label: 'Member',
                  description:
                    'Can only read organization data and have no permissions to create, update, or delete resources',
                },
              ]}
              renderOption={({ option }) => (
                <div>
                  <strong>{option.label}</strong>
                  <div className="text-sm">{option.description}</div>
                </div>
              )}
              name={field.name}
              value={field.state.value}
              onChange={(value) => value && field.handleChange(value)}
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
          title: 'Member updated',
          message: `${member.user.name} has been updated`,
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to update member',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
  };
}
