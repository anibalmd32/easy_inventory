import { ProductData } from './inventoryData'
import { LoadingData } from '@/definitions/types'
import ProductsOperations from '../context/stateOperations/ProductsOperations';
import { z } from 'zod';
import { formSchema } from '../components/ProductsForm/schema';

export interface InventoryCtx {
	products: ProductData[];
	loadingProducts: LoadingData;
	productsOperations: ProductsOperations;
	openForm: boolean;
	setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
	defaultFormValues: z.infer<typeof formSchema>;
	setDefaultFormvalues: React.Dispatch<React.SetStateAction<z.infer<typeof formSchema>>>;
	producId: number | null;
	setProductId: React.Dispatch<React.SetStateAction<number | null>>;
}
