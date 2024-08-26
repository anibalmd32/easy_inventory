import { columns } from "./columns"
import { ProductMock, productsMock } from './productsMock'
import { DataTable } from '@/components/shared/DataTable'

export function ProductsTable() {
	return (
		<div>
			<DataTable columns={columns} data={productsMock} />
		</div>
	)
}
