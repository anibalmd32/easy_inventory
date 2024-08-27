'use client'

import * as React from 'react'
import { productsReducer } from '../reducers'
import { InventoryCtx, ProductData } from '../definitions'
import { LoadingData } from '@/definitions/types';
import { LoadingDataStates } from '@/definitions/enums';
import LoaderOperations from './stateOperations/LoaderOperations';
import ProductsOperations from './stateOperations/ProductsOperations';
import { z } from 'zod';
import { formSchema } from '../components/ProductsForm/schema';

export const InventoryContext = React.createContext<InventoryCtx>({} as InventoryCtx);

export default function InventoryProvider({ children, initialProducts }: {
	children: React.ReactNode,
	initialProducts: ProductData[]
}) {
	const [loadingProducts, setLoadingProducts] = React.useState<LoadingData>({
		state: LoadingDataStates.LOADING,
		message: 'Cargando productos...',
	});
	const [productsState, dispatchProduct] = React.useReducer(productsReducer, initialProducts);
	const [producId, setProductId] = React.useState<number | null>(null)
	const [openForm, setOpenForm] = React.useState(false)
	const [defaultFormValues, setDefaultFormvalues] = React.useState<z.infer<typeof formSchema>>({
		name: "",
		price: "0",
		quantity: "0",
		category: null,
	})

	const loaderOperations = new LoaderOperations(setLoadingProducts);
	const productsOperations = new ProductsOperations({
		dispatcher: dispatchProduct,
		loader: loaderOperations,
	});

	return (<InventoryContext.Provider value={{
		products: productsState,
		loadingProducts,
		productsOperations,
		openForm,
		setOpenForm,
		defaultFormValues,
		setDefaultFormvalues,
		producId,
		setProductId,
	}}>
		{children}
	</InventoryContext.Provider>);
}
