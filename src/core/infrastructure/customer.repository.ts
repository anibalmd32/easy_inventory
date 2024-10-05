import { AppRepository } from '../domain/app.domain';
import { Customer } from '@/definitions';
import { prisma } from '@/lib/prisma';

export default class CustomerRepository implements AppRepository<Customer> {
  async add(data: Customer): Promise<Customer> {
    const newCustomer = await prisma.customer.create({
      data: {
        dni: data.dni,
        name: data.name,
        phone: data.phone,
      },
    });

    return newCustomer;
  }

  async delete(id: number): Promise<Customer> {
    return {} as Customer;
  }

  async getById(id: number): Promise<Customer> {
    return {} as Customer;
  }

  async getList(): Promise<Customer[]> {
    return [] as Customer[];
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    return {} as Customer;
  }
}
