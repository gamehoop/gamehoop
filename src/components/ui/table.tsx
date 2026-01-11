import { Table as BaseTable } from '@mantine/core';
import { MouseEventHandler, PropsWithChildren } from 'react';
import { UISize } from '.';

export interface TableProps extends PropsWithChildren {
  className?: string;
  highlightOnHover?: boolean;
  horizontalSpacing?: UISize;
  stickyHeader?: boolean;
  striped?: boolean;
  withColumnBorders?: boolean;
  withTableBorder?: boolean;
  withRowBorders?: boolean;
  verticalSpacing?: UISize;
  variant?: 'default' | 'vertical';
}

export function Table(props: TableProps) {
  return <BaseTable tabularNums {...props} />;
}

export interface TableHeadProps extends PropsWithChildren {
  className?: string;
}

Table.Head = function TableHead(props: TableHeadProps) {
  return <BaseTable.Thead {...props} />;
};

export interface TableBodyProps extends PropsWithChildren {
  className?: string;
}

Table.Body = function TableBody(props: TableBodyProps) {
  return <BaseTable.Tbody {...props} />;
};

export interface TableTrProps extends PropsWithChildren {
  className?: string;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
}

Table.Tr = function TableTr(props: TableTrProps) {
  return <BaseTable.Tr {...props} />;
};

export interface TableThProps extends PropsWithChildren {
  className?: string;
}

Table.Th = function TableTh(props: TableThProps) {
  return <BaseTable.Th {...props} />;
};

export interface TableTdProps extends PropsWithChildren {
  className?: string;
  onClick?: MouseEventHandler<HTMLTableCellElement>;
  title?: string;
}

Table.Td = function TableTd(props: TableTdProps) {
  return <BaseTable.Td {...props} />;
};

export interface TableCaptionProps extends PropsWithChildren {
  className?: string;
}

Table.Caption = function TableCaption(props: TableCaptionProps) {
  return <BaseTable.Caption {...props} />;
};
