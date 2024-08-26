import { LoadingDataStates,  ReducerActionTypes } from './enums';

export type LoadingData = {
	state: LoadingDataStates;
	message: string;
}

export type ReducerAction<T> = {
	type: ReducerActionTypes;
	payload: {
		data: T;
	};
}
