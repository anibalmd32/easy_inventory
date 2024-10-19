import { LoadingData, Product, Category } from '@/definitions';
import InventoryEventHandlers from '@/eventHandlers/InventoryEventHandlers';
import { z } from 'zod';
import { formSchema } from './components/ProductsForm/schema';

export interface InventoryCtx {
  products: Product[];
  categories: Category[];
  inventoryEvents: InventoryEventHandlers;
  defaultFormValues: z.infer<typeof formSchema>;
  setDefaultValues: React.Dispatch<
    React.SetStateAction<z.infer<typeof formSchema>>
  >;
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  productId: number | null;
  setProductId: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface InitialData {
  products: Product[];
  categories: Category[];
}

export interface ProviderProps {
  children: React.ReactNode;
  initialData: InitialData;
}