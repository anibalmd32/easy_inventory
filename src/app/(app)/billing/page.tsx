/** PROVIDERS */
import { BillingProvider } from './BillingProvider'

/** SERVER ACTIONS */
import { getProductsAsCartItems } from '@/actions/Products/ProductsServer'

/** COMPONENTS */
import { ProductSelect } from './components/ProductSelect'
import { ProductDetails } from './components/ProductDetails'
import { Cart } from './components/Cart'
import { CustomerForm } from './components/CustomerForm'

export default async function BillingPage() {
  const products = await getProductsAsCartItems()

  return (
    <BillingProvider initialProducts={products}>
      <div>
        <h2 className='text-gray-200 font-bold text-3xl'>Facturación</h2>

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
