import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { modals } from '@/components/ui/modals';
import { Select } from '@/components/ui/select';
import { TextInput } from '@/components/ui/text-input';
import { Organization } from '@/lib/auth';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/logger';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { AtSign } from 'lucide-react';
import z from 'zod';

const modalId = 'invite-member-modal';

export function useInviteMemberModal({
  organization,
}: {
  organization: Organization;
}) {
  const router = useRouter();
  const notify = useNotifications();

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
      modals.updateModal({
        modalId,
        confirmProps: { loading: true },
      });

      try {
        await authClient.organization.inviteMember({
          email: value.email,
          organizationId: organization.id,
          role: value.role as 'admin' | 'member',
          resend: true,
        });
        modals.close(modalId);
        form.reset(value);
        await router.invalidate();
        notify.success({
          title: 'Member invitation sent',
          message: 'An invitation has been sent via email.',
        });
      } catch (err) {
        logger.error(err);
        notify.error({
          title: 'Failed to send member invitation',
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
      title: <span className="font-bold">Invite Member</span>,
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

          <form.Field name="role">
            {(field) => (
              <Select
                label="Role"
                data={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'member', label: 'Member' },
                ]}
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
      labels: { confirm: 'Invite', cancel: 'Cancel' },
      closeOnConfirm: false,
      onConfirm: () => form.handleSubmit(),
    });
  };

  return open;
}
