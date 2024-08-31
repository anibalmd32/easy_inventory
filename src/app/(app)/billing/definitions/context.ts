import { Product } from "@/definitions";
import SelectProductOperations from "../context/operations/SelectProductOperations";

export interface BillingCtx {
	products: Product[];
	selectedProduct: Product | null;
	selectProductCounter: number;
	cartState: ICart;
	selectProductOperations: SelectProductOperations
}

export interface ProductInCart extends Product {
	quantity: number;
	totalProductPrice: number;
}

export interface ICart {
	id: string;
	products: ProductInCart[];
	total: number;
}