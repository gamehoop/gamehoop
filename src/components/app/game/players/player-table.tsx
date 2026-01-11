import { Table } from '@/components/ui/table';
import { Player } from '@/db/types';

export interface PlayerTableProps {
  player: Player;
}

export function PlayerTable({ player }: PlayerTableProps) {
  return (
    <Table variant="vertical" withTableBorder className="mt-4">
      <Table.Body>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Td>{player.name}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Email</Table.Th>
          <Table.Td>{player.email}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Email Verified</Table.Th>
          <Table.Td>{player.emailVerified ? 'Yes' : 'No'}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Anonymous</Table.Th>
          <Table.Td>{player.isAnonymous ? 'Yes' : 'No'}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Last Login At</Table.Th>
          <Table.Td>
            {player.lastLoginAt?.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Created At</Table.Th>
          <Table.Td>
            {player.createdAt?.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Updated At</Table.Th>
          <Table.Td>
            {player.updatedAt?.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Table.Td>
        </Table.Tr>
      </Table.Body>
    </Table>
  );
}
