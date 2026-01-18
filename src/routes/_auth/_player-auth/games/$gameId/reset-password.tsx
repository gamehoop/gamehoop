import { Alert, AlertProps } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { Title } from '@/components/ui/title';
import { getPublicGameDetails } from '@/functions/game/get-public-game-details';
import { resetPassword } from '@/functions/player-auth/reset-password';
import { seo } from '@/utils/seo';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';

export const Route = createFileRoute(
  '/_auth/_player-auth/games/$gameId/reset-password',
)({
  validateSearch: z.object({
    token: z.string().catch(''),
  }),
  loader: async ({ params: { gameId } }) => {
    const game = await getPublicGameDetails({ data: { gameId } });
    return { game };
  },
  head: ({ loaderData }) => ({
    meta: seo({ title: `Reset Password | ${loaderData?.game.name}` }),
  }),
  component: PlayerResetPassword,
});

function PlayerResetPassword() {
  const { token } = Route.useSearch();
  const { game } = Route.useLoaderData();
  const [hasReset, setHasReset] = useState(false);

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
      try {
        await resetPassword({
          data: {
            gameId: game.id,
            newPassword: value.password,
            token,
          },
        });

        setAlertProps({
          status: 'success',
          title: 'Password reset successful',
        });
        setHasReset(true);
      } catch (error) {
        setAlertProps({
          status: 'error',
          title: 'Password reset failed.',
          children: (
            <span>
              {error instanceof Error ? error.message : 'Unknown error'}
            </span>
          ),
        });
      }
    },
  });

  return (
    <Card className="w-112.5">
      <Card.Section>
        <div className="flex justify-between items-center mb-2">
          <Title order={2}>Reset Password</Title>
          {game.logo && <Avatar src={`/api/games/${game.id}/logo`} />}
        </div>

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
                disabled={!canSubmit || isSubmitting || hasReset}
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
