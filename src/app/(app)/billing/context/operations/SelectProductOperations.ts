import { Product } from "@/definitions/entities";
import { ICart } from '@/app/(app)/billing/definitions/context';
import { CartReducerAction, CART_ACTIONS } from "../../reducers/cartReducer";
import { generateCartId } from "@/lib/utils";

interface SelectProductOperationsDeps {
	products: Product[];
	selectedProduct: Product | null;
	setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
	selectProductCounter: number;
	setSelectProductCounter: React.Dispatch<React.SetStateAction<number>>;
	cart: ICart;
	setCart: React.Dispatch<React.SetStateAction<ICart>>;
	cartDispatcher: React.Dispatch<CartReducerAction>
}

export default class SelectProductOperations {
	private products: Product[];
	private selectedProduct: Product | null;
	private setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
	private selectProductCounter: number;
	private setSelectProductCounter: React.Dispatch<React.SetStateAction<number>>;
	private cart: ICart;
	private setCart: React.Dispatch<React.SetStateAction<ICart>>;
	private cartDispatcher: React.Dispatch<CartReducerAction>

	constructor(deps: SelectProductOperationsDeps) {
		this.products = deps.products;
		this.selectedProduct = deps.selectedProduct;
		this.setSelectedProduct = deps.setSelectedProduct;
		this.selectProductCounter = deps.selectProductCounter;
		this.setSelectProductCounter = deps.setSelectProductCounter;
		this.cart = deps.cart;
		this.setCart = deps.setCart;
		this.cartDispatcher = deps.cartDispatcher;
	}

	onSelectProduct = (productId: number) => {
		const product = this.products.find((product) => product.id === productId);
		this.setSelectProductCounter(1);

		if (!product) {
			return;
		}

		this.setSelectedProduct(product);

		if (product.id === this.selectedProduct?.id) {
			this.setSelectProductCounter(this.selectProductCounter + 1);
		}
	}

	onUnselectProduct = () => {
		this.setSelectedProduct(null);
		this.setSelectProductCounter(1);
	}

	onSelectProductCounterIncrement = () => {
		this.setSelectProductCounter(this.selectProductCounter + 1);
	}

	onSelectProductCounterDecrement = () => {
		this.setSelectProductCounter(this.selectProductCounter - 1);
	}

	onAddProductToCart = () => {
		const product = this.selectedProduct;

		if (!product) {
			return;
		}

		const productQuantity = this.setSelectProductCounter ?? 1;
		const productTotal = (Number(productQuantity) * Number(product.price)).toFixed(2)
		const id = generateCartId();

		const cartItem: ICart = {
			id,
			products: [{
				...product,
				quantity: Number(productQuantity),
				totalProductPrice: Number(productTotal)
			}],
			total: Number(productTotal)
		}

		console.log('este es el item a añadir', cartItem);

		this.cartDispatcher({
			type: CART_ACTIONS.ADD,
			payload: {
				data: cartItem
			}
		})
	}
}
