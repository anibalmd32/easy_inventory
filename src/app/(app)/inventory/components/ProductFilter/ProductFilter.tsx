import { Table } from "@tanstack/react-table"
import { ProductData } from "../../definitions"
import { Input } from "@/components/ui/input"

interface ProductFilterProps {
	table: Table<ProductData>
}

export function ProductFilter({ table }: ProductFilterProps) {
	return (
		<div className="flex items-center justify-between py-4">
			<Input
				placeholder="Buscar productos..."
				value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
				onChange={(event) =>
					table.getColumn("name")?.setFilterValue(event.target.value)
				}
				className="max-w-sm bg-gray-950 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
			/>
      </div>
	)
}
