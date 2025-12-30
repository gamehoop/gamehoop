import { AuthCardHeader } from '@/components/app/auth/auth-card-header';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { Alert, AlertProps } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextInput } from '@/components/ui/text-input';
import { env } from '@/env/client';
import { signUp } from '@/lib/auth/client';
import { getAlertPropsForError } from '@/lib/auth/errors';
import { seo } from '@/utils/seo';
import { PasswordInput } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { AtSign, CircleUserRound, Lock } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';

export const Route = createFileRoute('/_auth/sign-up')({
  beforeLoad: async ({ context: { user } }) => {
    if (user) {
      throw redirect({ to: '/' });
    }
  },
  head: () => ({ meta: seo({ title: `Sign Up | ${env.VITE_APP_NAME}` }) }),
  component: SignUp,
});

function SignUp() {
  const [showForm, setShowForm] = useState(true);
  const [alertProps, setAlertProps] = useState<AlertProps>();

  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
    },
    validators: {
      onSubmit: z
        .object({
          email: z.email().min(1),
          name: z.string().min(1),
          password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
          passwordConfirmation: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
          error: 'The password confirmation does not match',
          path: ['passwordConfirmation'],
        }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
        callbackURL: '/?verified=true',
      });

      if (error) {
        setAlertProps(getAlertPropsForError(error));
      } else {
        setShowForm(false);
        setAlertProps({
          title: 'Please verify your email',
          children: 'A verification email has been sent to your inbox.',
        });
      }
    },
  });

  return (
    <Card className="w-112.5">
      <Card.Section>
        <AuthCardHeader>Sign Up</AuthCardHeader>

        {showForm && (
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
                  placeholder="you@example.com"
                  leftSection={<AtSign />}
                  required
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
                  error={field.state.meta.errors[0]?.message}
                  placeholder="What should we call you?"
                  leftSection={<CircleUserRound />}
                  required
                />
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <PasswordInput
                  label="Password"
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
                  label="Confirm Password"
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
                  Sign Up
                </Button>
              )}
            </form.Subscribe>

            <div className="text-center text-sm">
              <span>Already have an account? </span>
              <AnchorLink to="/sign-in" size="sm">
                Sign in
              </AnchorLink>
            </div>
          </form>
        )}

        {alertProps && <Alert className="mt-4" {...alertProps} />}
      </Card.Section>
    </Card>
  );
}
