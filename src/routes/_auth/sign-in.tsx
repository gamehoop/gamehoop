import { AuthCardHeader } from '@/components/app/auth/auth-card-header';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { Alert, AlertProps } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { TextInput } from '@/components/ui/text-input';
import { env } from '@/env/client';
import { signIn } from '@/libs/auth/client';
import { getAlertPropsForError } from '@/libs/auth/errors';
import { seo } from '@/utils/seo';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { AtSign, Lock } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';

export const Route = createFileRoute('/_auth/sign-in')({
  validateSearch: z.object({
    email: z.string().optional().catch(''),
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

  const form = useForm({
    defaultValues: {
      email: search.email ?? '',
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
            <AnchorLink to="/sign-up" search={{ ...search }} size="sm">
              Sign up
            </AnchorLink>
          </div>
        </form>

        {alertProps && <Alert className="mt-4" {...alertProps} />}
      </Card.Section>
    </Card>
  );
}
