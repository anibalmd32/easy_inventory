import { CHART_FOR, TRENDING, LoadingDataStates,  MONTHS,  ReducerActionTypes } from './enums';

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
		tendency: TRENDING;
	},
	isCash?: boolean;
}

export type MonthlyChartItem = {
	month: MONTHS,
	[CHART_FOR.PAID]: number;
	[CHART_FOR.CANCELED]: number
}
