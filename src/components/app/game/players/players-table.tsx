import { ActionIcon } from '@/components/ui/action-icon';
import { Menu } from '@/components/ui/menu';
import { Table } from '@/components/ui/table';
import { Player } from '@/db/types';
import { useSessionContext } from '@/hooks/use-session-context';
import { ArrowDown, Ellipsis, Trash2 } from 'lucide-react';
import { useDeletePlayerModal } from './delete-player-modal';

export interface PlayersTableProps {
  players: Player[];
}

export function PlayersTable({ players }: PlayersTableProps) {
  const { user } = useSessionContext();
  const openDeletePlayerModal = useDeletePlayerModal();

  return (
    <Table striped withTableBorder className="mt-4">
      <Table.Head>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Email Verified</Table.Th>
          <Table.Th>Anonymous</Table.Th>
          <Table.Th>Last Login At</Table.Th>
          <Table.Th className="flex flex-row gap-1 items-center">
            Created At <ArrowDown />
          </Table.Th>
          <Table.Th>Updated At</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Head>
      <Table.Body>
        {players
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((player) => (
            <Table.Tr key={player.id}>
              <Table.Td>{player.name}</Table.Td>
              <Table.Td>{player.email}</Table.Td>
              <Table.Td>{player.emailVerified ? 'Yes' : 'No'}</Table.Td>
              <Table.Td>{player.isAnonymous ? 'Yes' : 'No'}</Table.Td>
              <Table.Td title={player.lastLoginAt?.toISOString()}>
                {player.lastLoginAt?.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Table.Td>
              <Table.Td title={player.createdAt.toISOString()}>
                {player.createdAt.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Table.Td>
              <Table.Td title={player.createdAt.toISOString()}>
                {player.updatedAt?.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                }) ?? ''}
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
                      leftSection={<Trash2 />}
                      onClick={() => openDeletePlayerModal(player)}
                      disabled={user.role === 'member'}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
      </Table.Body>
    </Table>
  );
}
