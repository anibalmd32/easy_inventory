import { Customer } from '@/definitions';
import CustomerRepository from '../infrastructure/customer.repository';

export default class CustomerServices {
  constructor(private readonly repository: CustomerRepository) {}

  async createNewCustomer(customer: Customer) {
    return await this.repository.add(customer);
  }
}
