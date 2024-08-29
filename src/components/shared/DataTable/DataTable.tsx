"use client"

import { DataTableProps } from './types'
import { DataTableFilter } from "./DataTableFilter"
import { DataTableContainer } from './DataTableContainer'
import { DataTablePagination } from "./DataTablePagination"

export function DataTable<TData, TValue>({
	columns,
	tableHook,
	filterColumn
}: DataTableProps<TData, TValue>) {

	return (
		<div>
			<DataTableFilter tableHook={tableHook} filterColumn={filterColumn} />
			<DataTableContainer columns={columns} tableHook={tableHook} />
			<DataTablePagination table={tableHook} />
		</div>
	)
}
