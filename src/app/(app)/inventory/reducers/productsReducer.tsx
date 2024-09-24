import { Product } from '@/definitions';
import { ReducerAction } from '@/definitions';

export enum PRODUCTS_ACTIONS {
  ADD,
  REMOVE,
  UPDATE,
}

export function productsReducer(
  state: Product[] = [],
  action: ReducerAction<Product, PRODUCTS_ACTIONS>
) {
  const onSaveData = () => {
    state = [action.payload.data, ...state];
  };

  const onRemoveData = () => {
    state = state.filter((item) => item.id !== action.payload.data.id);
  };

  const onUpdateData = () => {
    state = state.map((item) =>
      item.id === action.payload.data.id ? action.payload.data : item
    );
  };

  const actionIndex = {
    [PRODUCTS_ACTIONS.ADD]: onSaveData,
    [PRODUCTS_ACTIONS.REMOVE]: onRemoveData,
    [PRODUCTS_ACTIONS.UPDATE]: onUpdateData,
  };

  actionIndex[action.type]();

  return state;
}
