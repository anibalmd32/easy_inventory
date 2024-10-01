import { Product } from '@/definitions';

export interface IProductRepository {
  getList(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
  add(product: Product): Promise<Product>;
  update(id: number, product: Partial<Product>): Promise<Product>;
  delete(id: number): Promise<Product>;
}
