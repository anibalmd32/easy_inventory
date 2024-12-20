import { Table } from '@/components/ui/table';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
import { ColumnDef, Table as ReactTable } from '@tanstack/react-table';

type DataTableContainerProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  table: ReactTable<TData>;
  loading?: boolean;
};

export function DataTableContainer<TData, TValue>({
  columns,
  table,
  loading,
}: DataTableContainerProps<TData, TValue>) {
  return (
    <div className="rounded-md border bg-gray-950">
      <Table>
        <DataTableHeader table={table} />
        <DataTableBody table={table} columns={columns} loading={loading} />
      </Table>
    </div>
  );
}
