import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Title } from '@/components/ui/title';
import { Member, Organization } from '@/lib/auth';
import { capitalize } from '@/utils/string';
import { UserPlus } from 'lucide-react';
import { useInviteMemberModal } from './use-invite-member-modal';

export interface OrganizationMembersTableProps {
  organization: Organization & {
    members: Member[];
  };
}

export function OrganizationMembersTable({
  organization,
}: OrganizationMembersTableProps) {
  const openInviteMemberModel = useInviteMemberModal({ organization });

  return (
    <>
      <div className="flex items-center justify-between">
        <Title order={4}>Members</Title>
        <Button leftSection={<UserPlus />} onClick={openInviteMemberModel}>
          Invite Member
        </Button>
      </div>

      <Table striped withTableBorder className="mt-4">
        <Table.Head>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Date Added</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {organization.members.map((member) => (
            <Table.Tr key={member.id}>
              <Table.Td className="flex justify-center">
                <Avatar
                  src={member.user.image}
                  name={member.user.name}
                  size="md"
                />
              </Table.Td>
              <Table.Td>{member.user.name}</Table.Td>
              <Table.Td>{member.user.email}</Table.Td>
              <Table.Td>{capitalize(member.role)}</Table.Td>
              <Table.Td>
                {member.createdAt.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
