import { AccountDangerZone } from '@/components/app/account/account-danger-zone';
import { AuthenticationSettings } from '@/components/app/account/authentication-settings';
import { UserSettingsForm } from '@/components/app/account/user-settings-form';
import { Divider } from '@/components/ui/divider';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/account')({
  loader: async ({ context: { user } }) => {
    return { user };
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.user.name || 'Account'} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Account,
});

function Account() {
  const { user } = Route.useLoaderData();

  return (
    <>
      <Title order={2}>My Account</Title>
      <p className="text-sm pb-4">
        User since{' '}
        {user.createdAt.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          hour12: true,
        })}
      </p>

      <UserSettingsForm />

      <Divider />
      <AuthenticationSettings />

      <Divider />
      <AccountDangerZone />
    </>
  );
}
