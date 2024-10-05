'use server';
import ProductService from '@/core/application/product.services';
import ProductRepository from '@/core/infrastructure/product.repository';
import { CartItem, Product } from '@/definitions';
import cartItemMapper from '@/lib/mappers/cartItemMapper';

const repository = new ProductRepository();
const services = new ProductService(repository);

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const allProducts = await services.getProductList();
    return allProducts;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createProduct = async (product: Product): Promise<Product> => {
  try {
    const newProduct = await services.createNewProduct(product);

    return newProduct;
  } catch (error) {
    console.error(error);
    return {} as Product;
  }
};

export const removeProduct = async (id: number): Promise<Product> => {
  try {
    return await services.deleteProduct(id);
  } catch (error) {
    console.log(error);
    return {} as Product;
  }
};

export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  try {
    return await services.updatePartiallyProduct(id, product);
  } catch (error) {
    return {} as Product;
  }
};

export const getProductsAsCartItems = async (): Promise<CartItem[]> => {
  try {
    const products = await services.getProductList();
    return cartItemMapper(products);
  } catch (error) {
    return [];
  }
};
