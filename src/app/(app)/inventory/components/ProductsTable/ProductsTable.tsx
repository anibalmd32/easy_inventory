"use client"
import useInventory from "../../context/useInventory"
import { DataTable } from "@/components/shared/DataTable"
import { productsTableColumns } from '../../utils/productsTableColumns'

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
