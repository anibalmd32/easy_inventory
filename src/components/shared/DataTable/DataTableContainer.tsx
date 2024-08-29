import { Table } from "@/components/ui/table"
import { DataTableHeader } from "./DataTableHeader"
import { DataTableBody } from "./DataTableBody"
import { DataTableProps } from './types'

export function DataTableContainer<TData, TValue>({
	columns,
	tableHook,
}: DataTableProps<TData, TValue>) {

	return (
		<div className="rounded-md border bg-gray-950">
			<Table>
				<DataTableHeader table={tableHook} />
				<DataTableBody tableHook={tableHook} columns={columns} />
			</Table>
		</div>
	)
}
