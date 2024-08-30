import { COUNT_TENDENCY, LoadingDataStates,  ReducerActionTypes } from './enums';

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

export type EntityCountItem = {
	title: string;
	icon: any;
	totalCount: number;
	percentage: {
		rate: string;
		tendency: COUNT_TENDENCY;
	},
	isCash?: boolean;
}
