import { Button } from "@/components/ui/button"
import { DataTableComponentsProps } from "./types"

export function DataTablePagination<TData>({
	table,
}: DataTableComponentsProps<TData>) {
	return (
		<div className="flex items-center justify-end space-x-2 py-4">
			<Button
				variant="outline"
				size="sm"
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
				className="bg-gray-900 hover:bg-gray-800 hover:text-gray-200 text-gray-200 transition-all duration-300"
			>
				Anterior
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
				className="bg-gray-900 hover:bg-gray-800 hover:text-gray-200 text-gray-200 transition-all duration-300"
			>
				Siguiente
			</Button>
		</div>
	)
}
