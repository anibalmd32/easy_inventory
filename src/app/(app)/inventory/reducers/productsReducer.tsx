import { ProductData } from "../definitions/inventoryData";
import { ActionTypes } from "@/definitions/enums";
import { ReducerAction } from "@/definitions/types";

export function productsReducer(state: ProductData[] = [], action: ReducerAction<ProductData>) {
	const onSaveData = () => {
		state = [action.payload.data, ...state];
	}

	const onRemoveData = () => {
		state = state.filter(item => item.id !== action.payload.data.id);
	}

	const onUpdateData = () => {
		state = state.map(item => item.id === action.payload.data.id ? action.payload.data : item);
	}

	const actionIndex = {
		[ActionTypes.ADD]: onSaveData,
		[ActionTypes.REMOVE]: onRemoveData,
		[ActionTypes.UPDATE]: onUpdateData,
	}

	if (actionIndex[action.type]) {
		actionIndex[action.type]();
		return state;
	}

	return state;
}
