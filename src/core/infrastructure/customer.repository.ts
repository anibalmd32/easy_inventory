import { AppRepository } from '../domain/app.domain';
import { Customer } from '@/definitions';
import { prisma } from '@/lib/prisma';

export default class CustomerRepository {
  async add(data: Customer): Promise<Customer> {
    const existCustomer = await prisma.customer.findUnique({
      where: { dni: data.dni },
    });

    if (existCustomer) return existCustomer;

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

  async getByDni(dni: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({ where: { dni } });
    return customer;
  }

  async getList(): Promise<Customer[]> {
    return [] as Customer[];
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    return {} as Customer;
  }

  async validate(dni: string, name: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({ where: { dni } });

    if (customer) {
      if (customer.name === name) {
        return customer;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
