import { Customer } from '@/definitions';
import CustomerRepository from '../infrastructure/customer.repository';

export default class CustomerServices {
  constructor(private readonly repository: CustomerRepository) {}

  async createNewCustomer(customer: Customer) {
    return await this.repository.add(customer);
  }

  async getOneCustomer(dni: string) {
    return this.repository.getByDni(dni);
  }

  async getCustomerByDniAndPrefix(dni: string, prefix: string) {
    return this.repository.getByDniAndPrefix(dni, prefix);
  }

  async validateCustomer(dni: string, name: string) {
    return await this.repository.validate(dni, name);
  }
}
