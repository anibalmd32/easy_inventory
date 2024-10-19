import { Product, ReducerAction } from '@/definitions';
import { PRODUCTS_ACTIONS } from '@/app/(app)/inventory/reducers';
import {
  createProduct,
  removeProduct,
  updateProduct,
} from '@/core/frameworks/server-actions/products.actions';
import ToastEventHandlers from './ToastEventHandlers';

type EventHandlerDeps = {
  productsDispatcher: React.Dispatch<ReducerAction<Product, PRODUCTS_ACTIONS>>;
  toastEvents: ToastEventHandlers;
};

export default class InventoryEventHandlers {
  private deps: EventHandlerDeps;

  constructor(deps: EventHandlerDeps) {
    this.deps = deps;
  }

  public async add(product: Product) {
    //? Alerta de enviando
    this.deps.toastEvents.trigger({
      title: 'Cargando...',
      description: 'Agregando producto'
    });

    try {
      //? Llamada a la API para insertar el producto en la base de datos
      const newProduct = await createProduct(product);

      //? Actualización del estado de los productos para optimistic UI
      this.deps.productsDispatcher({
        type: PRODUCTS_ACTIONS.ADD,
        payload: {
          data: newProduct,
        },
      });

      //? Alerta de operación exitosa
      this.deps.toastEvents.trigger({
        title: 'Éxito',
        description: 'El producto fue agregado correctamente'
      });

    } catch (error: any) {
      //? Alerta de error si ocurre un error al agregar un producto a la base de datos
      this.deps.toastEvents.error({
        title: 'Error',
        description: `Ocurrió un error al agregar el producto: ${error.message}`
      });
      return;
    }
  }

  public async remove(product: Product) {
    //? Alerta de enviando
    this.deps.toastEvents.trigger({
      title: 'Cargando...',
      description: 'Eliminando producto'
    });

    try {
      //? Llamada a la API para eliminar el producto en la base de datos
      await removeProduct(product.id);

      //? Actualización del estado de los productos para optimistic UI
      this.deps.productsDispatcher({
        type: PRODUCTS_ACTIONS.REMOVE,
        payload: {
          data: product,
        },
      });

      //? Alerta de operación exitosa
      this.deps.toastEvents.trigger({
        title: 'Éxito',
        description: 'El producto fue eliminado correctamente'
      });

    } catch (error: any) {
      //? Alerta de error si ocurre un error al eliminar un producto a la base de datos
      this.deps.toastEvents.error({
        title: 'Error',
        description: `Ocurrió un error al eliminar el producto: ${error.message}`
      });

      return;
    }
  }

  public async update(product: Product) {
    //? Alerta de enviando
    this.deps.toastEvents.trigger({
      title: 'Cargando...',
      description: 'Actualizando producto'
    });

    try {
      //? Llamada a la API para actualizar el producto en la base de datos
      await updateProduct(product.id, product);

      //? Actualización del estado de los productos para optimistic UI
      this.deps.productsDispatcher({
        type: PRODUCTS_ACTIONS.UPDATE,
        payload: {
          data: product,
        },
      });

      //? Alerta de operación exitosa
      this.deps.toastEvents.trigger({
        title: 'Éxito',
        description: 'El producto fue actualizado correctamente'
      });

    } catch (error: any) {
      //? Alerta de error si ocurre un error al actualizar un producto de la base de datos
      this.deps.toastEvents.error({
        title: 'Error',
        description: `Ocurrió un error al actualizar el producto: ${error.message}`
      });

      return;
    }
  }
}
