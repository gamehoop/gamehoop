import { useOpenAsyncConfirmModal } from '@/components/ui/hooks/use-async-confirm-model';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Select } from '@/components/ui/select';
import { TextInput } from '@/components/ui/text-input';
import { useSessionContext } from '@/hooks/use-session-context';
import { Organization } from '@/lib/auth';
import { authClient } from '@/lib/auth/client';
import { useForm } from '@tanstack/react-form';
import { AtSign } from 'lucide-react';
import z from 'zod';

export interface UseInviteMemberModalProps {
  organization: Organization;
}

export function useInviteMemberModal({
  organization,
}: UseInviteMemberModalProps) {
  const { user } = useSessionContext();
  const notify = useNotifications();
  const openAsyncConfirmModal = useOpenAsyncConfirmModal();

  const form = useForm({
    defaultValues: {
      email: '',
      role: 'member',
    },
    validators: {
      onSubmit: z.object({
        email: z.email().min(1),
        role: z.enum(['admin', 'member']),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.organization.inviteMember({
        email: value.email,
        organizationId: organization.id,
        role: value.role as 'admin' | 'member',
        resend: true,
      });

      if (error) {
        throw error;
      }
    },
  });

  return () =>
    openAsyncConfirmModal({
      title: 'Invite Member',
      children: (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          <form.Field name="email">
            {(field) => (
              <TextInput
                type="email"
                label="Email"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
                leftSection={<AtSign />}
              />
            )}
          </form.Field>

          {user.role !== 'member' && (
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
          )}
        </form>
      ),
      confirmLabel: 'Invite',
      size: 'md',
      validate: async () => {
        await form.validate('submit');
        return form.state.isValid;
      },
      onConfirm: async () => form.handleSubmit(),
      onClose: () => form.reset(),
      onSuccess: () => {
        notify.success({
          title: 'Member invitation sent',
          message: 'An invitation has been sent via email.',
        });
      },
      onError: () => {
        notify.error({
          title: 'Failed to send member invitation',
          message: 'Something went wrong. Please try again.',
        });
      },
    });
}
