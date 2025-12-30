import { OrganizationMembersTable } from '@/components/app/organization/organization-members-table';
import { OrganizationSettingsForm } from '@/components/app/organization/organization-settings-form';
import { Divider } from '@/components/ui/divider';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getOrganization } from '@/functions/user/get-organization';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/organization')({
  loader: async ({ context: { user } }) => {
    const organization = await getOrganization();
    return { user, organization };
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.organization.name || 'Organization'} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Organization,
});

function Organization() {
  const { organization } = Route.useLoaderData();

  return (
    <>
      <Title order={2}>My Organization</Title>
      <p className="text-sm pb-4">
        Your account is linked to your organization.
      </p>

      <OrganizationSettingsForm organization={organization} />

      <Divider />
      <OrganizationMembersTable organization={organization} />
    </>
  );
}
