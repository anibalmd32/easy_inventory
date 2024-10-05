import { Sale } from '@/definitions';
import SaleRepository from '../infrastructure/sale.repository';

export default class SaleServices {
  constructor(private readonly repository: SaleRepository) {}

  async createNewSale(customerId: number, sale: Sale) {
    return await this.repository.add(customerId, sale);
  }
}
