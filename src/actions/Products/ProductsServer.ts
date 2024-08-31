'use server'
import { productsMock } from './products.mock'

export class ProductsServer {
	async getProducts() {
		return productsMock
	}
}
