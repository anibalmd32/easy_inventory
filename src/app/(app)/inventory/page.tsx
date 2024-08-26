import InventoryProvider from './context/InventoryProvider'
import { ProductsTable } from './components/ProductsTable'

export default function InventoryPage() {
	return (
		<InventoryProvider initialProducts={[]}>
			<div>
				<h2 className='text-gray-200 font-bold text-3xl'>Inventario</h2>
				<ProductsTable />
			</div>
		</InventoryProvider>
	)
}
