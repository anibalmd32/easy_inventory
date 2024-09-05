'use client'
import * as React from 'react'
import { productsReducer } from './reducers'
import { LoadingData, Product, Category } from '@/definitions';
import { loaderInitialState } from '@/lib/utils'
import LoaderOperations from '@/operations/LoaderOperations';
import ProductsOperations from '@/operations/ProductsOperations';
import { z } from "zod";
import { formSchema, formSchemaDefaultValues } from './components/ProductsForm/schema'

interface InventoryCtx {
  products: Product[];
  categories: Category[]
  loadingProducts: LoadingData;
  productsOperations: ProductsOperations;
  defaultFormValues: z.infer<typeof formSchema>;
  setDefaultValues: React.Dispatch<React.SetStateAction<z.infer<typeof formSchema>>>;
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  productId: number | null;
  setProductId: React.Dispatch<React.SetStateAction<number | null>>;
}

interface InitialData {
  products: Product[];
  categories: Category[]
}

interface ProviderProps {
  children: React.ReactNode;
  initialData: InitialData;
}

export const InventoryContext = React.createContext<InventoryCtx>({} as InventoryCtx);

export function InventoryProvider({ children, initialData }: ProviderProps) {
  const [loadingProducts, setLoadingProducts] = React.useState<LoadingData>(loaderInitialState);
  const [categories] = React.useState<Category[]>(initialData.categories);
  const [productsState, dispatchProduct] = React.useReducer(productsReducer, initialData.products);
  const [defaultFormValues, setDefaultValues] = React.useState(formSchemaDefaultValues)
  const [openForm, setOpenForm] = React.useState<boolean>(false);
  const [productId, setProductId] = React.useState<number | null>(null)

  const loaderOperations = new LoaderOperations(setLoadingProducts);
  const productsOperations = new ProductsOperations({
    productsDispatcher: dispatchProduct,
    loader: loaderOperations,
  });

  return (<InventoryContext.Provider value={{
    products: productsState,
    categories,
    loadingProducts,
    productsOperations,
    defaultFormValues,
    setDefaultValues,
    openForm,
    setOpenForm,
    productId,
    setProductId
  }}>
    {children}
  </InventoryContext.Provider>);
}
