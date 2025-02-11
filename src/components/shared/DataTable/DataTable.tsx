'use client';

import { DataTableFilter } from './DataTableFilter';
import { DataTableContainer } from './DataTableContainer';
import { DataTablePagination } from './DataTablePagination';
import { useDataTable } from './useDataTable';
import { ColumnDef } from '@tanstack/react-table';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  loading?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  loading,
}: DataTableProps<TData, TValue>) {
  const { table } = useDataTable({ data, columns });

  return (
    <div>
      <DataTableFilter table={table} filterColumn={filterColumn} />
      <DataTableContainer columns={columns} table={table} loading={loading} />
      <DataTablePagination table={table} />
    </div>
  );
}
