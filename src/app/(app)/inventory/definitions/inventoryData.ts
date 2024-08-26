import { Product, Category } from '@/definitions/entities'

export interface ProductData extends Product {
	category: Category;
}
