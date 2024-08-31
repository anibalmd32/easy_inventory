/** PROVIDERS */
import { InventoryProvider } from './InventoryProvider'

/** SERVER ACTIONS */
import { ProductsServer } from '../../../actions/Products/ProductsServer'

/** COMPONENTS */
import { ProductsTable } from './components/ProductsTable'
import { PageTitle } from '@/components/shared/PageTitle'

export default async function InventoryPage() {
	const productsServer = new ProductsServer()
	const products = await productsServer.getProducts()

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
