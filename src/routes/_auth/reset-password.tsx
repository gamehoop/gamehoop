import { AuthCardHeader } from '@/components/app/auth/auth-card-header';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { Alert, AlertProps } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { env } from '@/env/client';
import { resetPassword } from '@/libs/auth/client';
import { getAlertPropsForError } from '@/libs/auth/errors';
import { seo } from '@/utils/seo';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';

export const Route = createFileRoute('/_auth/reset-password')({
  head: () => ({
    meta: seo({ title: `Reset Password | ${env.VITE_APP_NAME}` }),
  }),
  component: ResetPassword,
  validateSearch: z.object({
    token: z.string().catch(''),
  }),
});

function ResetPassword() {
  const { token } = Route.useSearch();

  const [alertProps, setAlertProps] = useState<AlertProps>();

  const form = useForm({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    validators: {
      onSubmit: z
        .object({
          password: z.string().min(8),
          passwordConfirmation: z.string().min(8),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
          error: 'The password confirmation does not match',
          path: ['passwordConfirmation'],
        }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await resetPassword({
        newPassword: value.password,
        token,
      });

      if (error) {
        setAlertProps(getAlertPropsForError(error));
      } else {
        setAlertProps({
          status: 'success',
          title: 'Password reset successful',
          children: (
            <span>
              You can now{' '}
              <AnchorLink to="/sign-in" size="sm">
                sign in
              </AnchorLink>{' '}
              with your new password.
            </span>
          ),
        });
      }
    },
  });

  return (
    <Card className="w-112.5">
      <Card.Section>
        <AuthCardHeader>Reset Password</AuthCardHeader>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          <form.Field name="password">
            {(field) => (
              <PasswordInput
                label="New Password"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                placeholder="********"
                leftSection={<Lock />}
                required
              />
            )}
          </form.Field>

          <form.Field name="passwordConfirmation">
            {(field) => (
              <PasswordInput
                label="Confirm New Password"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    await form.handleSubmit();
                  }
                }}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                placeholder="********"
                leftSection={<Lock />}
                required
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                onClick={() => form.handleSubmit()}
                disabled={!canSubmit || isSubmitting}
                loading={isSubmitting}
                fullWidth
              >
                Reset Password
              </Button>
            )}
          </form.Subscribe>
        </form>

        {alertProps && <Alert className="mt-4" {...alertProps} />}
      </Card.Section>
    </Card>
  );
}
