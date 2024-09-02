import { CartItem, Cart } from "@/definitions";
import { Dispatch, SetStateAction } from "react";

interface SelectProductOperationsDeps {
	products: CartItem[];
	selectedProduct: CartItem | null;
	setSelectedProduct: React.Dispatch<React.SetStateAction<CartItem | null>>;
	cart: Cart;
	setCart: Dispatch<SetStateAction<Cart>>;
}

export default class SelectProductOperations {
	private products: CartItem[];
	private selectedProduct: CartItem | null;
	private setSelectedProduct: React.Dispatch<React.SetStateAction<CartItem | null>>;
	private cart: Cart;
	private setCart: Dispatch<SetStateAction<Cart>>;

	constructor(deps: SelectProductOperationsDeps) {
		this.products = deps.products;
		this.selectedProduct = deps.selectedProduct;
		this.setSelectedProduct = deps.setSelectedProduct;
		this.cart = deps.cart;
		this.setCart = deps.setCart;
	}

	onSelectProduct = (productId: number) => {
		const product = this.products.find((product) => product.id === productId);

		if (!product) {
			return;
		}

		this.setSelectedProduct(product);
	}

	onUnselectProduct = () => {
		this.setSelectedProduct(null);
	}

	onSelectProductCounterIncrement = () => {
		if (this.selectedProduct) {
			this.setSelectedProduct({
				...this.selectedProduct,
				amount: this.selectedProduct.amount + 1,
			})
		}
	}

	onSelectProductCounterDecrement = () => {
		if (this.selectedProduct) {
			this.setSelectedProduct({
				...this.selectedProduct,
				amount: this.selectedProduct.amount - 1,
			})
		}
	}

	onAddProductToCart = () => {
		const product = this.selectedProduct;

		if (product) {
			const totalPerProduct = Number(product.amount) * Number(product.price)
			this.setCart({
				items: [...this.cart.items, product],
				total: Number(this.cart.total) + Number(totalPerProduct),
				customerName: ''
			})
		}
	}
}
