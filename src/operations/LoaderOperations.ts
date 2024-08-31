import React from 'react';
import { LoadingData } from '@/definitions/types';
import { FETCH_STATUS } from '@/definitions/enums';

type SetLoadingData = React.Dispatch<React.SetStateAction<LoadingData>>;

class LoaderOperations {
	private _setLoadingData: SetLoadingData;

	constructor(setLoadingData: SetLoadingData) {
		this._setLoadingData = setLoadingData;
	}

	public trigger() {
		this._setLoadingData({
			state: FETCH_STATUS.LOADING,
			message: 'Cargando...',
		});
	}

	public success() {
		this._setLoadingData({
			state: FETCH_STATUS.SUCCESS,
			message: 'Operación realizada exitosamente',
		});
	}

	public error() {
		this._setLoadingData({
			state: FETCH_STATUS.ERROR,
			message: 'Error al realizar la operación',
		});
	}
}

export default LoaderOperations;
