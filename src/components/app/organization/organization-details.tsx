import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Title } from '@/components/ui/title';
import { useSessionContext } from '@/hooks/use-session-context';
import { FullOrganization } from '@/lib/auth';
import { DoorOpen } from 'lucide-react';
import { OrganizationMembersTable } from './organization-members-table';
import { OrganizationSettingsForm } from './organization-settings-form';
import { PendingInvitationsTable } from './pending-invitations-table';
import { useLeaveOrganizationModal } from './use-leave-organization-modal';

export interface OrganizationDetailsProps {
  organization: FullOrganization;
}

export function OrganizationDetails({
  organization,
}: OrganizationDetailsProps) {
  const { user } = useSessionContext();

  const openLeaveOrganizationModal = useLeaveOrganizationModal({
    organization,
  });

  return (
    <div>
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

        {user.role !== 'owner' && (
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
      <PendingInvitationsTable invitations={organization.invitations} />
    </div>
  );
}
