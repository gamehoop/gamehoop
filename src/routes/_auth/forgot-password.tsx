import { AuthCardHeader } from '@/components/app/auth/auth-card-header';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { Alert, AlertProps } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { env } from '@/env/client';
import { requestPasswordReset } from '@/lib/auth/client';
import { getAlertPropsForError } from '@/lib/auth/errors';
import { seo } from '@/utils/seo';
import { Card } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { AtSign } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';

export const Route = createFileRoute('/_auth/forgot-password')({
  head: () => ({
    meta: seo({ title: `Forgot Password | ${env.VITE_APP_NAME}` }),
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [alertProps, setAlertProps] = useState<AlertProps>();

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: z.object({
        email: z.email().min(1),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await requestPasswordReset({
        email: value.email,
        redirectTo: '/reset-password',
      });

      if (error) {
        setAlertProps(getAlertPropsForError(error));
      } else {
        setAlertProps({
          title: 'Please check your email',
          children: 'A reset password link has been sent to your inbox.',
        });
      }
    },
  });

  return (
    <Card className="w-112.5">
      <Card.Section>
        <AuthCardHeader>Forgot Password</AuthCardHeader>

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
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    await form.handleSubmit();
                  }
                }}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                placeholder="you@example.com"
                leftSection={<AtSign />}
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
                Send Reset Email
              </Button>
            )}
          </form.Subscribe>

          <div className="text-center text-sm">
            <span>Remembered? </span>
            <AnchorLink to="/sign-in" size="sm">
              Sign in
            </AnchorLink>
          </div>
        </form>

        {alertProps && <Alert className="mt-4" {...alertProps} />}
      </Card.Section>
    </Card>
  );
}
