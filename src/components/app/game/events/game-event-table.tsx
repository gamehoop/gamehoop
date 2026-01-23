import { Table } from '@/components/ui/table';
import { GameEvent } from '@/db/types';
import { ActionIcon } from '@mantine/core';
import { Copy, ExternalLink } from 'lucide-react';

export interface GameEventTableProps {
  event: GameEvent;
}

export function GameEventTable({ event }: GameEventTableProps) {
  return (
    <Table variant="vertical" withTableBorder className="mt-4">
      <Table.Body>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Td className="flex justify-between">
            <span>{event.id}</span>
            <ActionIcon
              variant="transparent"
              onClick={async () => {
                await navigator.clipboard.writeText(event.id);
              }}
            >
              <Copy />
            </ActionIcon>
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Td>{event.name}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Properties</Table.Th>
          <Table.Td>{JSON.stringify(event.properties)}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Player ID</Table.Th>
          <Table.Td className="flex justify-between">
            <span>{event.playerId}</span>
            {event.playerId && (
              <ActionIcon
                variant="transparent"
                onClick={() => {
                  window.open(
                    `/games/${event.gameId}/players/${event.playerId}`,
                    '_blank',
                  );
                }}
              >
                <ExternalLink />
              </ActionIcon>
            )}
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Session ID</Table.Th>
          <Table.Td>{event.sessionId}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Device ID</Table.Th>
          <Table.Td>{event.deviceId}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Timestamp</Table.Th>
          <Table.Td>
            {event.timestamp?.toLocaleDateString(undefined, {
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
