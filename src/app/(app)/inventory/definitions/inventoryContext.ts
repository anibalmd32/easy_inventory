import { ProductData } from './inventoryData'
import { LoadingData } from '@/definitions/types'
import ProductsOperations from '../context/stateOperations/ProductsOperations';

export interface InventoryCtx {
	products: ProductData[];
	loadingProducts: LoadingData;
	productsOperations: ProductsOperations;
}
