import { Product, Category } from '@/definitions'

export const cateogryMock: Category[] = [
	{ id: 1, name: 'auto', color: '#839dd1' },
	{ id: 2, name: 'bicicleta', color: '#e25151' },
	{ id: 3, name: 'moto', color: '#1bacb1' },
]

export const productsMock: Product[] = [
	{
		id: 1,
		name: 'Product 1',
		price: "100",
		categoryId: 1,
		quantity: 10,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[0]
	},
	{
		id: 2,
		name: 'Product 2',
		price: "200",
		categoryId: 2,
		quantity: 20,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[1]
	},
	{
		id: 3,
		name: 'Product 3',
		price: "300",
		categoryId: 3,
		quantity: 30,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[2]
	},
	{
		id: 4,
		name: 'Product 4',
		price: "400",
		categoryId: 4,
		quantity: 0,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[2]
	},
	{
		id: 5,
		name: 'Product 5',
		price: "500",
		categoryId: 5,
		quantity: 50,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[1]
	},
	{
		id: 6,
		name: 'Product 6',
		price: "600",
		categoryId: 6,
		quantity: 60,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[0]
	},
	{
		id: 7,
		name: 'Product 7',
		price: "700",
		categoryId: 7,
		quantity: 70,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[0]
	},
	{
		id: 8,
		name: 'Product 8',
		price: "800",
		categoryId: 8,
		quantity: 2,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[1]
	},
	{
		id: 9,
		name: 'Product 9',
		price: "900",
		categoryId: 9,
		quantity: 90,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[2]
	},
	{
		id: 10,
		name: 'Product 10',
		price: "1000",
		categoryId: 10,
		quantity: 100,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[1]
	},
	{
		id: 11,
		name: 'Product 11',
		price: "1100",
		categoryId: 11,
		quantity: 5,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[2]
	},
	{
		id: 12,
		name: 'Product 12',
		price: "1200",
		categoryId: 12,
		quantity: 120,
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		category: cateogryMock[0]
	}
]
