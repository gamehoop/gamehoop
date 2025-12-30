import { AuthCardHeader } from '@/components/app/auth/auth-card-header';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { Alert, AlertProps } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/components/ui/hooks/use-color-scheme';
import { TextInput } from '@/components/ui/text-input';
import { env } from '@/env/client';
import { getSession, signIn } from '@/lib/auth/client';
import { getAlertPropsForError } from '@/lib/auth/errors';
import { seo } from '@/utils/seo';
import { Card, PasswordInput } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { AtSign, Lock } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';

export const Route = createFileRoute('/_auth/sign-in')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: async ({ context: { user } }) => {
    if (user) {
      throw redirect({ to: '/' });
    }
  },
  head: () => ({ meta: seo({ title: `Sign In | ${env.VITE_APP_NAME}` }) }),
  component: SignIn,
});

function SignIn() {
  const router = useRouter();
  const search = Route.useSearch();
  const [alertProps, setAlertProps] = useState<AlertProps>();
  const { colorScheme, setColorScheme } = useColorScheme();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: z.object({
        email: z.email().min(1),
        password: z.string().min(1, { error: 'Password is required' }),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await signIn.email({
        email: value.email,
        password: value.password,
        rememberMe: true,
      });

      if (error) {
        setAlertProps(getAlertPropsForError(error));
      } else {
        await router.invalidate();
        await router.navigate({ to: search.redirect || '/' });

        const { data } = await getSession();
        if (data) {
          const user = data.user;
          const preferredColorScheme = user.settings?.darkMode
            ? 'dark'
            : 'light';
          if (colorScheme !== preferredColorScheme) {
            setColorScheme(preferredColorScheme);
          }
        }
      }
    },
  });

  return (
    <Card className="w-112.5">
      <Card.Section>
        <AuthCardHeader>Sign In</AuthCardHeader>

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
                leftSection={<AtSign />}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                placeholder="you@example.com"
                required
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <PasswordInput
                label={
                  <div className="flex items-center justify-between">
                    <span>
                      Password
                      <span className="text-[rgb(250,82,82)] ms-1">*</span>
                    </span>
                    <AnchorLink to="/forgot-password" size="sm" tabIndex={-1}>
                      Forgot password?
                    </AnchorLink>
                  </div>
                }
                leftSection={<Lock />}
                labelProps={{ className: 'w-full' }}
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
                Sign In
              </Button>
            )}
          </form.Subscribe>

          <div className="text-center text-sm">
            <span>Don't have an account? </span>
            <AnchorLink to="/sign-up" size="sm">
              Sign up
            </AnchorLink>
          </div>
        </form>

        {alertProps && <Alert className="mt-4" {...alertProps} />}
      </Card.Section>
    </Card>
  );
}
