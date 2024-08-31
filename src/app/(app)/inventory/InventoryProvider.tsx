'use client'
import * as React from 'react'
import { productsReducer } from './reducers'
import { LoadingData, Product } from '@/definitions';
import { loaderInitialState } from '@/lib/utils'
import LoaderOperations from '@/operations/LoaderOperations';
import ProductsOperations from '@/operations/ProductsOperations';

interface InventoryCtx {
	products: Product[];
	loadingProducts: LoadingData;
	productsOperations: ProductsOperations;
}

interface ProviderProps {
	children: React.ReactNode;
	initialData: Omit<InventoryCtx, 'productsOperations' | 'loadingProducts'>;
}

export const InventoryContext = React.createContext<InventoryCtx>({} as InventoryCtx);

export function InventoryProvider({ children, initialData }: ProviderProps) {
	const [loadingProducts, setLoadingProducts] = React.useState<LoadingData>(loaderInitialState);
	const [productsState, dispatchProduct] = React.useReducer(productsReducer, initialData.products);

	const loaderOperations = new LoaderOperations(setLoadingProducts);
	const productsOperations = new ProductsOperations({
		productsDispatcher: dispatchProduct,
		loader: loaderOperations,
	});

	return (<InventoryContext.Provider value={{
		products: productsState,
		loadingProducts,
		productsOperations,
	}}>
		{children}
	</InventoryContext.Provider>);
}
