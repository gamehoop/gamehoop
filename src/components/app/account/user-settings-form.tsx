import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/hooks/use-notifications';
import { Switch } from '@/components/ui/switch';
import { TextInput } from '@/components/ui/text-input';
import { deleteUserAvatar } from '@/functions/user/delete-user-avatar';
import { updateUser } from '@/functions/user/update-user';
import { updateUserAvatar } from '@/functions/user/update-user-avatar';
import { useSessionContext } from '@/hooks/use-session-context';
import { logger } from '@/lib/logger';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { AtSign, CircleUserRound, Save } from 'lucide-react';
import { ChangeEvent, useEffect, useRef } from 'react';
import z from 'zod';

export function UserSettingsForm() {
  const { user } = useSessionContext();
  const router = useRouter();
  const avatarInput = useRef<HTMLInputElement>(null);
  const notify = useNotifications();

  const form = useForm({
    defaultValues: {
      email: user.email,
      name: user.name,
      darkMode: user.settings?.darkMode ?? false,
    },
    validators: {
      onSubmit: z.object({
        email: z.email().min(1),
        name: z.string().min(1),
        darkMode: z.boolean(),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await updateUser({
          data: { ...value },
        });
        form.reset(value);
        await router.invalidate();
        notify.success({
          title: 'Account updated',
          message: 'Your changes have been saved.',
        });
      } catch (err) {
        logger.error(err);
        notify.error({
          title: 'Failed to update account',
          message: 'Something went wrong. Please try again.',
        });
      }
    },
  });

  useEffect(() => {
    // We invalidate the route when toggling the theme.
    // Reset the field to pick up the new value.
    const unsubscribe = router.subscribe('onLoad', () => {
      form.resetField('darkMode');
    });

    return () => unsubscribe();
  }, [router, form]);

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const maxFileSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxFileSizeBytes) {
      notify.error({
        title: 'Avatar file too large',
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
      formData.append('avatar', file);
      await updateUserAvatar({ data: formData });
      await router.invalidate();
      notify.success({
        title: 'Avatar updated',
        message: 'Your new avatar has been uploaded.',
      });
    } catch (err) {
      logger.error(err);
      notify.error({
        title: 'Failed to update avatar',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  const onDeleteAvatar = async () => {
    try {
      await deleteUserAvatar();
      await router.invalidate();
      notify.success({
        title: 'Avatar deleted',
        message: 'Your avatar has been removed.',
      });
    } catch (err) {
      logger.error(err);
      notify.error({
        title: 'Failed to delete avatar',
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
          ref={avatarInput}
          type="file"
          className="hidden"
          onChange={onAvatarChange}
        />
        <Avatar
          onClick={() => {
            avatarInput.current?.click();
          }}
          src={user.image ? `/api/user/avatar?url=${user.image}` : ''}
          alt=""
          className="cursor-pointer"
          size="xl"
        />
        {user.image && (
          <Button variant="subtle" size="sm" onClick={onDeleteAvatar}>
            Delete Avatar
          </Button>
        )}
      </div>

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
            description={
              user.emailVerified
                ? 'A confirmation email will be sent to your current address for approval'
                : ''
            }
          />
        )}
      </form.Field>

      <form.Field name="name">
        {(field) => (
          <TextInput
            label="Name"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            leftSection={<CircleUserRound />}
            error={field.state.meta.errors[0]?.message}
            required
          />
        )}
      </form.Field>

      <form.Field name="darkMode">
        {(field) => (
          <Switch
            name={field.name}
            label="Dark Mode"
            checked={field.state.value}
            onChange={(e) => field.handleChange(e.target.checked)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
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
