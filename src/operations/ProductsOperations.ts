import { Product, ReducerAction } from '@/definitions';
import { PRODUCTS_ACTIONS } from '@/app/(app)/inventory/reducers';
import LoaderOperations from '@/operations/LoaderOperations';
import {
  createProduct,
  removeProduct,
  updateProduct,
} from '@/core/frameworks/server-actions/products.actions';

type ProductOperationsDependency = {
  productsDispatcher: React.Dispatch<ReducerAction<Product, PRODUCTS_ACTIONS>>;
  loader: LoaderOperations;
};

class ProductsOperations {
  private _dependency: ProductOperationsDependency;

  constructor(dependency: ProductOperationsDependency) {
    this._dependency = dependency;
  }

  public async add(product: Product) {
    this._dependency.loader.trigger();

    try {
      // TODO: Llamada a la API ✔
      const newProduct = await createProduct(product);

      // Para refrescar la UI de forma optimista
      this._dependency.productsDispatcher({
        type: PRODUCTS_ACTIONS.ADD,
        payload: {
          data: newProduct,
        },
      });

      this._dependency.loader.success();
    } catch (error) {
      this._dependency.loader.error();
      return;
    }
  }

  public async remove(product: Product) {
    this._dependency.loader.trigger();

    try {
      // TODO: Llamada a la API
      await removeProduct(product.id);

      this._dependency.productsDispatcher({
        type: PRODUCTS_ACTIONS.REMOVE,
        payload: {
          data: product,
        },
      });

      this._dependency.loader.success();
    } catch (error) {
      this._dependency.loader.error();
      return;
    }
  }

  public async update(product: Product) {
    this._dependency.loader.trigger();

    try {
      // TODO: Llamada a la API
      await updateProduct(product.id, product);

      this._dependency.productsDispatcher({
        type: PRODUCTS_ACTIONS.UPDATE,
        payload: {
          data: product,
        },
      });

      this._dependency.loader.success();
    } catch (error) {
      this._dependency.loader.error();
      return;
    }
  }
}

export default ProductsOperations;
