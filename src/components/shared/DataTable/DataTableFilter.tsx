import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table";

type DataTableFilterProps<TData> = {
	table: Table<TData>;
	filterColumn?: string;
}

export function DataTableFilter<TData>({
	table,
	filterColumn
}: Omit<DataTableFilterProps<TData>, "columns">) {
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
