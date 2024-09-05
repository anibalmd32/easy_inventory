'use server'
import { CartItem, Category } from '@/definitions'
import { ComboboxItem } from '@/components/shared/Combobox'
import { productsMock, categoryMock } from './products.mock'
import cartItemMapper from '@/lib/mappers/cartItemMapper'
import productCategoryMapper from '@/lib/mappers/productCategoryMapper'

export async function getProducts() {
  return productsMock
}

export async function getProductsAsCartItems(): Promise<CartItem[]> {
  return cartItemMapper(productsMock);
}

export async function getProductCategoryItems(): Promise<Category[]> {
  return categoryMock;
} 
