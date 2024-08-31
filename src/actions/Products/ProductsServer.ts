'use server'
import { productsMock } from './products.mock'

export async function getProducts() {
	return productsMock
}
