import { Product } from '@/definitions';
import { ReducerAction } from '@/definitions';

export enum CART_ACTIONS {
  ADD,
  REMOVE,
}

export function cartReducer(
  state: Product[] = [],
  action: ReducerAction<Product, CART_ACTIONS>
) {
  const onAddToCart = () => {
    state = [action.payload.data, ...state];
  };

  const onRemoveFromCart = () => {
    state = state.filter((item) => item.id !== Number(action.payload.data.id));
  };

  const indexActions = {
    [CART_ACTIONS.ADD]: onAddToCart,
    [CART_ACTIONS.REMOVE]: onRemoveFromCart,
  };

  indexActions[action.type]();

  return state;
}
