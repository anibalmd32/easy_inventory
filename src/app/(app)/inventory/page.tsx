/** PROVIDERS */
import { InventoryProvider } from './InventoryProvider';

/** SERVER ACTIONS */
import {
  getProducts,
  getProductCategoryItems,
} from '@/actions/Products/ProductsServer';

/** COMPONENTS */
import { ProductsTable } from './components/ProductsTable';
import { ProductsForm } from './components/ProductsForm';
// import {  } from './components/ProductsForm'
import { PageTitle } from '@/components/shared/PageTitle';

export default async function InventoryPage() {
  const products = await getProducts();
  const categories = await getProductCategoryItems();

  return (
    <InventoryProvider
      initialData={{
        products,
        categories,
      }}
    >
      <div>
        <div className="flex justify-between">
          <PageTitle>Inventario</PageTitle>
          <ProductsForm />
        </div>
        <ProductsTable />
      </div>
    </InventoryProvider>
  );
}
