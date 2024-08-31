'use client'
import { Product } from '@/definitions/entities';
import React from 'react';
import { BillingCtx, ICart } from '@/app/(app)/billing/definitions/context';
import SelectProductOperations from './operations/SelectProductOperations';
import { cartReducer } from '../reducers/cartReducer'

export const BillingContext = React.createContext<BillingCtx>({} as BillingCtx);

export default function BillingProvider({
	children,
	initialProducts
}: {
	children: React.ReactNode,
	initialProducts: Product[]
}) {
	const [products, setProducts] = React.useState<Product[]>(initialProducts);
	const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
	const [selectProductCounter, setSelectProductCounter] = React.useState(1);
	const [cart, setCart] = React.useState<ICart>({
		id: '',
		products: [],
		total: 0
	});

	const [cartState, dispatch] = React.useReducer(cartReducer, cart);

	const selectProductOperations = new SelectProductOperations({
		products,
		selectedProduct,
		setSelectedProduct,
		selectProductCounter,
		setSelectProductCounter,
		cart,
		setCart,
		cartDispatcher: dispatch,
	});

	return (
		<BillingContext.Provider value={{
			products,
			selectedProduct,
			selectProductCounter,
			cartState,
			selectProductOperations
		}}>
			{children}
		</BillingContext.Provider>
	);
}
