import { Avatar } from '@/components/ui/avatar';
import { Table } from '@/components/ui/table';
import { Title } from '@/components/ui/title';
import { Member } from '@/lib/auth';

export interface OrganizationMembersTableProps {
  organization: {
    members: Member[];
  };
}

export function OrganizationMembersTable({
  organization,
}: OrganizationMembersTableProps) {
  return (
    <>
      <Title order={4}>Members</Title>
      <Table striped withTableBorder className="mt-4">
        <Table.Head>
          <Table.Th></Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Date Added</Table.Th>
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
              <Table.Td>{member.role}</Table.Td>
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
