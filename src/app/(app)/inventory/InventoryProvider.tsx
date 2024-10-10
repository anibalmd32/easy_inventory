'use client';
import * as React from 'react';
import { productsReducer } from './reducers';
import InventoryEventHandlers from '@/eventHandlers/InventoryEventHandlers';
import ToastEventHandlers from '@/eventHandlers/ToastEventHandlers';
import { formSchemaDefaultValues } from './components/ProductsForm/schema';
import { Category } from '@/definitions';
import { InventoryCtx, ProviderProps } from './definitions';
import { useToast } from '@/components/hooks/use-toast';

export const InventoryContext = React.createContext<InventoryCtx>({} as InventoryCtx);

export function InventoryProvider({ children, initialData }: ProviderProps) {

  //? State for static data
  const [categories] = React.useState<Category[]>(initialData.categories);

  //? States for dynamic form
  const [defaultFormValues, setDefaultValues] = React.useState(formSchemaDefaultValues);
  const [openForm, setOpenForm] = React.useState<boolean>(false);
  const [productId, setProductId] = React.useState<number | null>(null);

  const [openDropdown, setOpenDropdown] = React.useState(false);

  //? State for dynamic data
  const [productsState, dispatchProduct] = React.useReducer(productsReducer, initialData.products);

  //? Handler events
  const inventoryEvents = new InventoryEventHandlers({
    productsDispatcher: dispatchProduct,
    toastEvents: new ToastEventHandlers({
      toast: useToast().toast,
    }),
    setOpenDropdown,
  });

  return (
    <InventoryContext.Provider
      value={{
        products: productsState,
        categories,
        inventoryEvents,
        defaultFormValues,
        setDefaultValues,
        openForm,
        setOpenForm,
        productId,
        setProductId,
        openDropdown,
        setOpenDropdown
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => React.useContext(InventoryContext);
