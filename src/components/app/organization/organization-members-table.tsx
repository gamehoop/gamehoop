import { ActionIcon } from '@/components/ui/action-icon';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/ui/menu';
import { Table } from '@/components/ui/table';
import { Title } from '@/components/ui/title';
import { useSessionContext } from '@/hooks/use-session-context';
import { useUserRole } from '@/hooks/use-user-role';
import { Member, Organization } from '@/lib/auth';
import { capitalize } from '@/utils/string';
import {
  ArrowDownAZ,
  Ellipsis,
  UserPlus,
  UserRoundMinus,
  UserRoundPen,
} from 'lucide-react';
import { useInviteMemberModal } from './use-invite-member-modal';
import { useRemoveMemberModal } from './use-remove-member-modal';
import { useUpdateMemberModal } from './use-update-member-modal';

export interface OrganizationMembersTableProps {
  organization: Organization & {
    members: Member[];
  };
}

export function OrganizationMembersTable({
  organization,
}: OrganizationMembersTableProps) {
  const { user } = useSessionContext();
  const { isMember } = useUserRole();
  const openInviteMemberModel = useInviteMemberModal({ organization });
  const openRemoveMemberModal = useRemoveMemberModal({ organization });
  const openUpdateMemberModal = useUpdateMemberModal({ organization });

  return (
    <>
      <div className="flex items-center justify-between">
        <Title order={4}>Members ({organization.members.length})</Title>
        <Button
          leftSection={<UserPlus />}
          onClick={openInviteMemberModel}
          disabled={isMember}
        >
          Invite Member
        </Button>
      </div>

      <Table striped withTableBorder className="mt-4">
        <Table.Head>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th className="flex flex-row gap-1 items-center">
              Name <ArrowDownAZ />
            </Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Date Added</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {organization.members
            .sort((a, b) => a.user.name.localeCompare(b.user.name))
            .map((member) => (
              <Table.Tr key={member.id}>
                <Table.Td className="flex justify-center">
                  <Avatar
                    src={
                      member.user.image
                        ? `/api/user/${member.userId}/avatar`
                        : ''
                    }
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
                <Table.Td>
                  <Menu>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <Ellipsis />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<UserRoundPen />}
                        onClick={() => openUpdateMemberModal(member)}
                        disabled={
                          member.userId === user.id ||
                          member.role === 'owner' ||
                          isMember
                        }
                      >
                        Modify
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<UserRoundMinus />}
                        onClick={() => openRemoveMemberModal(member)}
                        disabled={member.userId === user.id || isMember}
                      >
                        Remove
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Body>
      </Table>
    </>
  );
}
