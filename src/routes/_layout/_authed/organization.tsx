import { OrganizationSettingsForm } from '@/components/app/organization/organization-settings-form';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/organization')({
  loader: async ({ context: { user } }) => {
    return { user };
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.user.organization.name || 'Organization'} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Organization,
});

function Organization() {
  const { user } = Route.useLoaderData();

  return (
    <>
      <Title order={2}>My Organization</Title>
      <p className="text-sm pb-4">
        Your account is linked to your organization.
      </p>

      <OrganizationSettingsForm user={user} />
    </>
  );
}
