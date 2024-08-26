import { Button } from "@/components/ui/button"
import { Table } from "@tanstack/react-table"
import { ProductData } from "../../definitions"

interface ProductsTablePaginationProps {
	table: Table<ProductData>
}

export function ProductsTablePagination({ table }: ProductsTablePaginationProps) {
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
