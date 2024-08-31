import { Product } from '@/definitions/entities'

export const productsMock: Product[] = [
	{
		id: 1,
		name: 'Product 1',
		price: "100",
		quantity: 10,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
	},
	{
		id: 2,
		name: 'Product 2',
		price: "200",
		quantity: 20,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
	},
	{
		id: 3,
		name: 'Product 3',
		price: "300",
		quantity: 30,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
	},
	{
		id: 4,
		name: 'Product 4',
		price: "400",
		quantity: 40,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
	},
]