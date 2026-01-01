import { OrganizationMembersTable } from '@/components/app/organization/organization-members-table';
import { OrganizationSettingsForm } from '@/components/app/organization/organization-settings-form';
import { PendingInvitationsTable } from '@/components/app/organization/pending-invitations-table';
import { useLeaveOrganizationModal } from '@/components/app/organization/use-leave-organization-modal';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { getActiveOrganization } from '@/functions/user/get-active-organization';
import { getActiveOrganizationInvitations } from '@/functions/user/get-active-organization-invitations';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';
import { DoorOpen } from 'lucide-react';

export const Route = createFileRoute('/_layout/_authed/organization')({
  loader: async ({ context: { user } }) => {
    const [organization, invitations] = await Promise.all([
      getActiveOrganization(),
      getActiveOrganizationInvitations(),
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
  const { user, organization, invitations } = Route.useLoaderData();
  const openLeaveOrganizationModal = useLeaveOrganizationModal({
    organization,
  });

  const userMember = organization.members.find((m) => m.userId === user.id);
  if (!userMember) {
    throw new Error('Failed to find user in organization');
  }

  const isOwner = userMember.role === 'owner';

  return (
    <>
      <div className="flex flex-row justify-between">
        <div>
          <Title order={2}>{organization.name}</Title>

          <p className="text-sm pb-4">
            Established{' '}
            {organization.createdAt.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {!isOwner && (
          <Button
            leftSection={<DoorOpen />}
            variant="default"
            onClick={openLeaveOrganizationModal}
          >
            Leave Organization
          </Button>
        )}
      </div>

      <OrganizationSettingsForm organization={organization} />

      <Divider />
      <OrganizationMembersTable organization={organization} />

      <Divider />
      <PendingInvitationsTable invitations={invitations} />
    </>
  );
}
