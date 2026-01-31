import { cn } from '@/utils/styles';
import {
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';
import { ActionIcon } from './action-icon';
import { Table } from './table';

export interface DataTableProps<T> {
  className?: string;
  columns: ColumnDef<T, any>[];
  data: T[];
  onRowClick?: (row: Row<T>) => void;
  sortBy?: ColumnSort[];
  striped?: boolean;
  withTableBorder?: boolean;
  pageSize?: number;
  globalFilter?: string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  className,
  striped,
  withTableBorder,
  globalFilter,
  sortBy = [],
  pageSize = 15,
}: DataTableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const [sorting, setSorting] = useState<SortingState>(sortBy);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      globalFilter,
    },
  });

  return (
    <>
      <Table
        striped={striped}
        withTableBorder={withTableBorder}
        highlightOnHover={!!onRowClick}
        className={className}
      >
        <Table.Head>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex gap-2 items-center'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {(header.column.getCanSort() &&
                          {
                            asc: <ArrowUp />,
                            desc: <ArrowDown />,
                          }[header.column.getIsSorted() as string]) ??
                          null}
                      </div>
                    )}
                  </Table.Th>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Head>
        <Table.Body>
          {table.getRowModel().rows.map((row) => {
            return (
              <Table.Tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Table.Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table>
      {table.getPageCount() > 1 && (
        <div className="flex items-center gap-2 my-4 justify-center">
          <ActionIcon
            variant="subtle"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </ActionIcon>

          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
        </div>
      )}
    </>
  );
}
