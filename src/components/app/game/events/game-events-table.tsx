import { ActionIcon } from '@/components/ui/action-icon';
import { Menu } from '@/components/ui/menu';
import { Table } from '@/components/ui/table';
import { Game, GameEvent } from '@/db/types';
import { useRouter } from '@tanstack/react-router';
import { ArrowDown, Ellipsis, Eye } from 'lucide-react';

export interface GameEventsTable {
  game: Game;
  events: GameEvent[];
}

export function GameEventsTable({ game, events }: GameEventsTable) {
  const router = useRouter();

  const onRowClick = async (event: GameEvent) => {
    await router.navigate({
      to: `/games/$gameId/events/$eventId`,
      params: {
        gameId: game.id,
        eventId: event.id,
      },
    });
  };

  return (
    <Table striped withTableBorder highlightOnHover className="mt-4">
      <Table.Head>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Properties</Table.Th>
          <Table.Th>Player ID</Table.Th>
          <Table.Th>Session ID</Table.Th>
          <Table.Th>Device ID</Table.Th>
          <Table.Th>
            <div className="flex flex-row gap-1 items-center">
              Timestamp <ArrowDown />
            </div>
          </Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Head>
      <Table.Body>
        {events.map((event) => (
          <Table.Tr
            key={event.id}
            onClick={() => onRowClick(event)}
            className="cursor-pointer"
          >
            <Table.Td>{event.name}</Table.Td>
            <Table.Td>{JSON.stringify(event.properties)}</Table.Td>
            <Table.Td>{event.playerId}</Table.Td>
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
            <Table.Td onClick={(e) => e.stopPropagation()}>
              <Menu>
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <Ellipsis />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<Eye />}
                    onClick={() => onRowClick(event)}
                  >
                    Open
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
