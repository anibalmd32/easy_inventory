'use server';

import { customersMock } from './customer.mock';

export async function getCustomers() {
  return customersMock;
}

export async function getCustomerByDni(dni: string) {
  return customersMock.find((customer) => customer.dni === dni);
}
