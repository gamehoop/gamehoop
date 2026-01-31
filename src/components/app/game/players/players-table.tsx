import { ActionIcon } from '@/components/ui/action-icon';
import { DataTable } from '@/components/ui/data-table';
import { Menu } from '@/components/ui/menu';
import { Game, Player } from '@/db/types';
import { useSessionContext } from '@/hooks/use-session-context';
import { DatesRangeValue } from '@mantine/dates';
import { useRouter } from '@tanstack/react-router';
import { createColumnHelper, Row } from '@tanstack/react-table';
import { Ellipsis, Eye, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useDeletePlayerModal } from './use-delete-player-modal';

export interface PlayersTableProps {
  game: Game;
  players: Player[];
  searchString?: string;
  dateRange?: DatesRangeValue<string>;
}

export function PlayersTable({
  game,
  players,
  searchString,
  dateRange,
}: PlayersTableProps) {
  const { user } = useSessionContext();
  const router = useRouter();
  const openDeletePlayerModal = useDeletePlayerModal();

  const columnFilters = useMemo(() => {
    if (!dateRange) {
      return [];
    }

    return [
      {
        id: 'createdAt',
        value: dateRange,
      },
    ];
  }, [dateRange]);

  const onRowClick = async ({ original: player }: Row<Player>) => {
    await router.navigate({
      to: `/games/$gameId/players/$playerId`,
      params: {
        gameId: game.id,
        playerId: player.id,
      },
    });
  };

  const columnHelper = createColumnHelper<Player>();
  const columnDefs = [
    columnHelper.accessor('name', {
      header: 'Name',
      filterFn: 'includesString',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      filterFn: 'includesString',
    }),
    columnHelper.accessor('emailVerified', {
      header: 'Email Verified',
      cell: ({ row }) => (row.original.emailVerified ? 'Yes' : 'No'),
    }),
    columnHelper.accessor('isAnonymous', {
      header: 'Anonymous',
      cell: ({ row }) => (row.original.isAnonymous ? 'Yes' : 'No'),
    }),
    columnHelper.accessor('lastLoginAt', {
      header: 'Last Login At',
      cell: ({ row }) => (
        <span title={row.original.lastLoginAt?.toISOString()}>
          {row.original.lastLoginAt?.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: ({ row }) => (
        <span title={row.original.createdAt?.toISOString()}>
          {row.original.createdAt?.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </span>
      ),
      filterFn: (row, _columnId, filterValue: DatesRangeValue<string>) => {
        const createdAtTime = row.original.createdAt.getTime();
        const [startDate, endDate] = filterValue;

        const start = startDate
          ? new Date(startDate).setHours(0, 0, 0, 0)
          : -Infinity;

        const end = endDate
          ? new Date(endDate).setHours(23, 59, 59, 999)
          : Infinity;

        return createdAtTime >= start && createdAtTime <= end;
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated At',
      cell: ({ row }) => (
        <span title={row.original.updatedAt?.toISOString()}>
          {row.original.updatedAt?.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      enableSorting: false,
      cell: ({ row }) => (
        <span
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Menu>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <Ellipsis />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<Eye />} onClick={() => onRowClick(row)}>
                Open
              </Menu.Item>
              <Menu.Item
                leftSection={<Trash2 />}
                onClick={() => openDeletePlayerModal(row.original)}
                disabled={user.role === 'member'}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </span>
      ),
    }),
  ];

  return (
    <DataTable
      data={players}
      columns={columnDefs}
      onRowClick={onRowClick}
      sortBy={[{ id: 'lastLoginAt', desc: true }]}
      globalFilter={searchString}
      columnFilters={columnFilters}
      striped
      withTableBorder
      className="mt-4"
    />
  );
}
