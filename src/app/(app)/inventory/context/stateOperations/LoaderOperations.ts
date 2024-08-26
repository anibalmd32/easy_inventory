import React from 'react';
import { LoadingData } from '@/definitions/types';
import { LoadingDataStates } from '@/definitions/enums';

type SetLoadingData = React.Dispatch<React.SetStateAction<LoadingData>>;

class LoaderOperations {
	private _setLoadingData: SetLoadingData;

	constructor(setLoadingData: SetLoadingData) {
		this._setLoadingData = setLoadingData;
	}

	public trigger() {
		this._setLoadingData({
			state: LoadingDataStates.LOADING,
			message: 'Cargando productos...',
		});
	}

	public success() {
		this._setLoadingData({
			state: LoadingDataStates.SUCCESS,
			message: 'Productos cargados exitosamente',
		});
	}

	public error() {
		this._setLoadingData({
			state: LoadingDataStates.ERROR,
			message: 'Error al cargar productos',
		});
	}
}

export default LoaderOperations;