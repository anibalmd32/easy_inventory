'use server'
import { CartItem } from '@/definitions'
import { productsMock } from './products.mock'
import cartItemMapper from '@/lib/mappers/cartItemMapper'

export async function getProducts() {
	return productsMock
}

export async function getProductsAsCartItems(): Promise<CartItem[]> {
	return cartItemMapper(productsMock);
}
