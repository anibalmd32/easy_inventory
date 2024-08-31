import { ICart } from '@/app/(app)/billing/definitions/context';
import { ActionTypes } from "@/definitions/enums";

export enum CART_ACTIONS {
	ADD,
	REMOVE,
}

export type CartReducerAction = {
	type: CART_ACTIONS;
	payload: {
		data: ICart;
	};
}


export function cartReducer(state: ICart = {} as ICart, action: CartReducerAction) {
	const onAddToCart = () => {		
		state.products = action.payload.data.products;
	}

	const onRemoveFromCart = () => {
		state.products = state.products.filter(item => item.id !== Number(action.payload.data.id));
	}

	const indexActions = {
		[ActionTypes.ADD]: onAddToCart,
		[ActionTypes.REMOVE]: onRemoveFromCart,
	}

	indexActions[action.type]();

	return state;
}