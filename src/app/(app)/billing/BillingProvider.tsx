'use client'
import { Cart, CartItem } from '@/definitions';
import { useState, createContext } from 'react';
import SelectProductOperations from '@/operations/SelectProductOperations';

interface BillingCtx {
	products: CartItem[];
	selectedProduct: CartItem | null;
	selectProductOperations: SelectProductOperations;
	cart: Cart;
}

interface ProviderProps {
	children: React.ReactNode;
	initialProducts: CartItem[]
}

export const BillingContext = createContext<BillingCtx>({} as BillingCtx);

export function BillingProvider({ children, initialProducts }: ProviderProps) {
	const [products, setProducts] = useState<CartItem[]>(initialProducts);
	const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
	const [cart, setCart] = useState<Cart>({
		items: [],
		total: 0,
		customerName: ''
	});

	const selectProductOperations = new SelectProductOperations({
		products,
		selectedProduct,
		setSelectedProduct,
		setCart,
		cart,
	});

	return (
		<BillingContext.Provider value={{
			products,
			selectedProduct,
			selectProductOperations,
			cart
		}}>
			{children}
		</BillingContext.Provider>
	);
}
