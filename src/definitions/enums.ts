export enum ActionTypes {
    ADD,
    REMOVE,
    UPDATE,
    SELL
}

export enum InvoiceStatus {
	PAID,
	PENDING,
	CANCELED
}

export enum LoadingDataStates {
    LOADING,
    SUCCESS,
    ERROR
}

export enum ReducerActionTypes {
    ADD,
    REMOVE,
    UPDATE,
}

export enum SortOrder {
    ASC,
    DESC
}

export enum TRENDING {
	UP = 1,
	DOWN = 2,
}

export enum MONTHS {
	ENERO = 'enero',
	FEBRERO = 'febrero',
	MARZO = 'marzo',
	ABRIL = 'abril',
	MAYO = 'mayo',
	JUNIO = 'junio',
	JULIO = 'julio',
	AGOSTO = 'agosto',
	SEPTIEMBRE = 'septiembre',
	OBTUBRE = 'obtubre',
	NOMVIEMBRE = 'noviembre',
	DICIEMBRE = 'diciembre'
}

export enum CHART_FOR {
	PAID = 'paid',
	CANCELED = 'canceled'
}
