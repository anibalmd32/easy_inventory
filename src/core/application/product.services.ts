import { Product } from '@/definitions';
import ProductRepository from '../infrastructure/product.repository';

export default class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getProductList() {
    return await this.productRepository.getList();
  }

  async getProductById(id: number) {
    return await this.productRepository.getById(id);
  }

  async updatePartiallyProduct(id: number, product: Partial<Product>) {
    return await this.productRepository.update(id, product);
  }

  async deleteProduct(id: number) {
    return await this.productRepository.delete(id);
  }

  async createNewProduct(product: Product) {
    return await this.productRepository.add(product);
  }

  async decrementProduct(id: number, quantity: number): Promise<void> {
    return await this.productRepository.decrementProductQuantity(id, quantity);
  }

  async incrementProduct(id: number, quantity: number): Promise<void> {
    return await this.productRepository.incrementProductQuantity(id, quantity);
  }
}
