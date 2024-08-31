export enum ActionTypes {
    ADD,
    REMOVE,
    SELL,
    UPDATE,
    SELECT,
    UNSELECT,
    BUY,
    CANCEL,
    PAY,
    DELETE,
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
