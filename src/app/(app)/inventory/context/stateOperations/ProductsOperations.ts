import { ReducerActionTypes } from "@/definitions/enums";
import { ProductData } from "../../definitions";
import LoaderOperations from "./LoaderOperations";
import { ReducerAction as ProductReducerAction } from "@/definitions/types";

type ProductOperationsDependency = {
	dispatcher: React.Dispatch<ProductReducerAction<ProductData>>;
	loader: LoaderOperations;
}

class ProductsOperations {
	private _dependency: ProductOperationsDependency;

	constructor(dependency: ProductOperationsDependency) {
		this._dependency = dependency;
	}

	public async add(product: ProductData) {
		this._dependency.loader.trigger();

		try {
			// TODO: Llamada a la API

			// Para refrescar la UI de forma optimista
			this._dependency.dispatcher({
				type: ReducerActionTypes.ADD,
				payload: {
					data: product,
				},
			});

			this._dependency.loader.success();
		} catch (error) {
			this._dependency.loader.error();
			return;
		}
	}

	public async remove(product: ProductData) {
		this._dependency.loader.trigger();

		console.log(product);

		try {
			// TODO: Llamada a la API

			this._dependency.dispatcher({
				type: ReducerActionTypes.REMOVE,
				payload: {
					data: product,
				},
			});

			this._dependency.loader.success();
		} catch (error) {
			this._dependency.loader.error();
			return;
		}
	}

	public async update(product: ProductData) {
		this._dependency.loader.trigger();
		
		try {
			// TODO: Llamada a la API	

			this._dependency.dispatcher({
				type: ReducerActionTypes.UPDATE,
				payload: {
					data: product,
				},
			});

			this._dependency.loader.success();
		} catch (error) {
			this._dependency.loader.error();
			return;
		}
	}
}

export default ProductsOperations;
