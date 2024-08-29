import { DataTableProps } from "./types"
import { Input } from "@/components/ui/input"

export function DataTableFilter<TData, TValue>({
	tableHook: table,
	filterColumn
}: Omit<DataTableProps<TData, TValue>, "columns">) {
	return (
		<div className="flex items-center justify-between py-4">
			<Input
				placeholder="Buscar..."
				value={(table.getColumn(filterColumn ?? "")?.getFilterValue() as string) ?? ""}
				onChange={(event) => table.getColumn(filterColumn ?? "")?.setFilterValue(event.target.value)}
				className="max-w-sm bg-gray-950 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
			/>
		</div>
	)
}
