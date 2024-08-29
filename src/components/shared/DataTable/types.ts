import { ColumnDef, Table } from "@tanstack/react-table"

export type DataTableComponentsProps<TData> = {
	table: Table<TData>
}

export type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[]
	tableHook: Table<TData>
	filterColumn?: string;
}
