'use server';
import { CartItem, Category, Product } from '@/definitions';
import { productsMock, categoryMock } from './products.mock';
import cartItemMapper from '@/lib/mappers/cartItemMapper';
import { prisma } from '@/lib/prisma';

export async function getProducts(): Promise<Product[]> {
  // try {
  //   const products = await prisma.product.findMany({
  //     include: { category: true }
  //   })

  //   return products
  // } catch (error) {
  //   console.log(error)
  //   return []
  // }
  return productsMock;
}

// export async function createProduct(product: Product): Promise<Product> {
//   try {
//     const createdProduct = await prisma.product.create({
//       data: product
//     })

//     return createdProduct
//   } catch (error) {
//     console.log(error)
//     return null
//   }
// }

export async function getProductsAsCartItems(): Promise<CartItem[]> {
  return cartItemMapper(productsMock);
}

export async function getProductCategoryItems(): Promise<Category[]> {
  return categoryMock;
}
