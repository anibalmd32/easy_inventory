import { Product } from '@/definitions';
import { IProductRepository } from '../domain/product.domain';

export default class ProductService {
  constructor(private productRepository: IProductRepository) {}

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
}
