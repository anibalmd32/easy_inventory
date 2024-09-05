'use server'
import { CartItem, Category } from '@/definitions'
import { productsMock, categoryMock } from './products.mock'
import cartItemMapper from '@/lib/mappers/cartItemMapper'

export async function getProducts() {
  return productsMock
}

export async function getProductsAsCartItems(): Promise<CartItem[]> {
  return cartItemMapper(productsMock);
}

export async function getProductCategoryItems(): Promise<Category[]> {
  return categoryMock;
} 
