import { Product, CartItem } from '@/definitions'

export default function cartItemMapper (products: Product[]): CartItem[] {
	return products.map(product => ({
		amount: 1,
		...product
	}))
}
