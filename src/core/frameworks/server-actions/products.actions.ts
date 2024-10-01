'use server';
import ProductService from '@/core/application/product.services';
import ProductRepository from '@/core/infrastructure/product.repository';
import { Product } from '@/definitions';

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
