import { Table } from '@/components/ui/table';
import { Game, GameEvent } from '@/db/types';
import { ArrowDown } from 'lucide-react';

export interface GameEventsTable {
  game: Game;
  events: GameEvent[];
}

export function GameEventsTable({ events }: GameEventsTable) {
  return (
    <Table striped withTableBorder className="mt-4">
      <Table.Head>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Properties</Table.Th>
          <Table.Th>Session ID</Table.Th>
          <Table.Th>Device ID</Table.Th>
          <Table.Th>
            <div className="flex flex-row gap-1 items-center">
              Timestamp <ArrowDown />
            </div>
          </Table.Th>
        </Table.Tr>
      </Table.Head>
      <Table.Body>
        {events.map((event) => (
          <Table.Tr key={event.id}>
            <Table.Td>{event.name}</Table.Td>
            <Table.Td>{JSON.stringify(event.properties)}</Table.Td>
            <Table.Td>{event.sessionId}</Table.Td>
            <Table.Td>{event.deviceId}</Table.Td>
            <Table.Td title={event.timestamp.toISOString()}>
              {event.createdAt.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Body>
    </Table>
  );
}
