/** PROVIDERS */
import { BillingProvider } from './BillingProvider';

/** SERVER ACTIONS */
import { getProductsAsCartItems } from '@/core/frameworks/server-actions/products.actions';

/** COMPONENTS */
import { ProductSelect } from './components/ProductSelect';
import { ProductDetails } from './components/ProductDetails';
import { Cart } from './components/Cart';
import { CustomerForm } from './components/CustomerForm';
import { PageTitle } from '@/components/shared/PageTitle';

export const revalidate = 0;

export default async function BillingPage() {
  const products = await getProductsAsCartItems();

  return (
    <BillingProvider initialProducts={products}>
      <div>
        <PageTitle>Facturación</PageTitle>

        <div className="grid grid-cols-1 gap-4 space-y-4 md:space-y-0 md:grid-cols-4 lg:grid-cols-3 mt-4">
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <ProductSelect />
            <ProductDetails />
            <CustomerForm />
          </div>
          <div className="md:col-span-2">
            <Cart />
          </div>
        </div>
      </div>
    </BillingProvider>
  );
}
