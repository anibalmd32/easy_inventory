'use client'

import * as React from 'react'
import { productsReducer } from '../reducers'
import { InventoryCtx, ProductData } from '../definitions'
import { LoadingData } from '@/definitions/types';
import { LoadingDataStates } from '@/definitions/enums';
import LoaderOperations from './stateOperations/LoaderOperations';
import ProductsOperations from './stateOperations/ProductsOperations';

export const InventoryContext = React.createContext<InventoryCtx>({
	products: [],
	loadingProducts: {
		state: LoadingDataStates.LOADING,
		message: 'Cargando productos...',
	},
	productsOperations: new ProductsOperations({
		dispatcher: () => { },
		loader: new LoaderOperations(() => { }),
	}),
});

export default function InventoryProvider({ children, initialProducts }: {
	children: React.ReactNode,
	initialProducts: ProductData[]
}) {
	const [loadingProducts, setLoadingProducts] = React.useState<LoadingData>({
		state: LoadingDataStates.LOADING,
		message: 'Cargando productos...',
	});
	const [productsState, dispatchProduct] = React.useReducer(productsReducer, initialProducts);

	const loaderOperations = new LoaderOperations(setLoadingProducts);
	const productsOperations = new ProductsOperations({
		dispatcher: dispatchProduct,
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
