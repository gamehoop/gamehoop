import { OrganizationMembersTable } from '@/components/app/organization/organization-members-table';
import { OrganizationSettingsForm } from '@/components/app/organization/organization-settings-form';
import { PendingInvitationsTable } from '@/components/app/organization/pending-invitations-table';
import { Divider } from '@/components/ui/divider';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getOrganization } from '@/functions/user/get-organization';
import { getOrganizationInvitations } from '@/functions/user/get-organization-invitations';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/organization')({
  loader: async ({ context: { user } }) => {
    const [organization, invitations] = await Promise.all([
      getOrganization(),
      getOrganizationInvitations(),
    ]);
    return { user, organization, invitations };
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.organization.name || 'Organization'} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Organization,
});

function Organization() {
  const { organization, invitations } = Route.useLoaderData();

  return (
    <>
      <Title order={2}>My Organization</Title>
      <p className="text-sm pb-4">
        Your account is linked to your organization.
      </p>

      <OrganizationSettingsForm organization={organization} />

      <Divider />
      <OrganizationMembersTable organization={organization} />

      <Divider />
      <PendingInvitationsTable invitations={invitations} />
    </>
  );
}
