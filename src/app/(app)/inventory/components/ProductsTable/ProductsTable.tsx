"use client"
import { useInventory } from "../../hooks/useInventory"
import { DataTable } from "@/components/shared/DataTable"
import { productsTableColumns } from './productsTableColumns'

export function ProductsTable() {
	const { products } = useInventory()

	return (
		<div>
			<DataTable
				columns={productsTableColumns}
				data={products}
				filterColumn="name"
			/>
		</div>
	)
}
