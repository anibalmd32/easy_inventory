'use server';
import CustomerRepository from '@/core/infrastructure/customer.repository';
import CustomerServices from '@/core/application/customer.services';
import { Customer } from '@/definitions';

const customerService = new CustomerServices(new CustomerRepository());

export const getCustomerByDni = async (
  dni: string,
): Promise<Customer | null> => {
  try {
    return await customerService.getOneCustomer(dni);
  } catch (error) {
    return null;
  }
};

export const validateCustomer = async (
  dni: string,
  name: string,
): Promise<Customer | null> => {
  try {
    return await customerService.validateCustomer(dni, name);
  } catch (error) {
    return null;
  }
};
