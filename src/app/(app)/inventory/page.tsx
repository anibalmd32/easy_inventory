/** PROVIDERS */
import { InventoryProvider } from './InventoryProvider';

/** SERVER ACTIONS */
import { getAllProducts } from '@/core/frameworks/server-actions/products.actions';
import { getAllCategories } from '@/core/frameworks/server-actions/categories.actions';

/** COMPONENTS */
import { ProductsTable } from './components/ProductsTable';
import { ProductsForm } from './components/ProductsForm';
import { PageTitle } from '@/components/shared/PageTitle';

export const revalidate = 0;

export default async function InventoryPage() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

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
