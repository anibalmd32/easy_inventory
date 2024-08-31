/** PROVIDERS */
import { InventoryProvider } from './InventoryProvider'

/** SERVER ACTIONS */
import { getProducts } from '@/actions/Products/ProductsServer'

/** COMPONENTS */
import { ProductsTable } from './components/ProductsTable'
import { PageTitle } from '@/components/shared/PageTitle'

export default async function InventoryPage() {
	const products = await getProducts()

	return (
		<InventoryProvider initialData={{
			products,
		}}>
			<div>
				<PageTitle>Inventario</PageTitle>
				<ProductsTable />
			</div>
		</InventoryProvider>
	)
}
