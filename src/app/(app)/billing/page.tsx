import BillingProvider from './context/BillingProvider'
import { ProductSelect } from './components/ProductSelect'
import { productsMock } from './components/ProductSelect/productsMock'
import { ProductDetails } from './components/ProductDetails'
import { Cart } from './components/Cart'
import { CustomerForm } from './components/CustomerForm'

export default function BillingPage() {
	return (
		<BillingProvider initialProducts={productsMock}>
			<div>
				<h2 className='text-gray-200 font-bold text-3xl'>Facturacion</h2>

				<div className='grid grid-cols-1 gap-4 space-y-4 md:space-y-0 md:grid-cols-3 mt-4'>
					<div className='md:space-y-4 md:col-span-1'>
						<ProductSelect />
						<ProductDetails />
						<CustomerForm />
					</div>
					<div className='md:col-span-2'>
						<Cart />
					</div>
				</div>
			</div>
		</BillingProvider>
	)
}
