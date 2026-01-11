import { ActionIcon } from '@/components/ui/action-icon';
import { Menu } from '@/components/ui/menu';
import { Table } from '@/components/ui/table';
import { Game, Player, PlayerSession } from '@/db/types';
import { useSessionContext } from '@/hooks/use-session-context';
import { ArrowDown, CircleX, Ellipsis } from 'lucide-react';
import { useRevokePlayerSessionModal } from './use-revoke-player-session-modal';

export interface PlayerSessionsTableProps {
  game: Game;
  player: Player;
  sessions: PlayerSession[];
}

export function PlayerSessionsTable({
  game,
  player,
  sessions,
}: PlayerSessionsTableProps) {
  const { user } = useSessionContext();
  const openRevokePlayerSessionModal = useRevokePlayerSessionModal();

  return (
    <Table striped withTableBorder className="mt-4">
      <Table.Head>
        <Table.Tr>
          <Table.Th className="flex flex-row gap-1 items-center">
            Created At <ArrowDown />
          </Table.Th>
          <Table.Th>Expires At</Table.Th>
          <Table.Th>IP Address</Table.Th>
          <Table.Th>User Agent</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Head>
      <Table.Body>
        {sessions
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((session) => (
            <Table.Tr key={session.id}>
              <Table.Td title={session.createdAt.toISOString()}>
                {session.createdAt.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Table.Td>
              <Table.Td title={session.expiresAt.toISOString()}>
                {session.expiresAt?.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                }) ?? 'Never'}
              </Table.Td>
              <Table.Td>{session.ipAddress || '-'}</Table.Td>
              <Table.Td>{session.userAgent || '-'}</Table.Td>
              <Table.Td>
                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="subtle">
                      <Ellipsis />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<CircleX />}
                      onClick={() =>
                        openRevokePlayerSessionModal({
                          game,
                          player,
                          session,
                        })
                      }
                      disabled={user.role === 'member'}
                    >
                      Revoke
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
