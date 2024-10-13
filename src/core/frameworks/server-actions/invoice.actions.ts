'use server';
import InvoiceRepository from '@/core/infrastructure/invoice.repository';
import InvoiceServices from '@/core/application/invoice.services';
import { Cart, Customer, Invoice } from '@/definitions';

const service = new InvoiceServices(new InvoiceRepository());

export const generateInvoice = async (cart: Cart, customer: Customer) => {
  try {
    const newInvoice = await service.createInvoice(cart, customer);
    return newInvoice;
  } catch (error) {
    console.log(error);
    return {} as Invoice;
  }
};

export const getInvoiceById = async (id: number): Promise<Invoice> => {
  try {
    return await service.getInvoiceById(id);
  } catch (error) {
    console.log(error);
    return {} as Invoice;
  }
};

export const payInvoice = async (id: number): Promise<Invoice> => {
  try {
    return await service.payInvoice(id);
  } catch (error) {
    console.log(error);
    return {} as Invoice;
  }
};

export const cancelInvoice = async (id: number): Promise<Invoice> => {
  try {
    return await service.cancelInvoice(id);
  } catch (error) {
    console.log(error);
    return {} as Invoice;
  }
};

export const getInvoiceList = async (): Promise<Invoice[]> => {
  try {
    return await service.getInvoiceList();
  } catch (error) {
    return [];
  }
};
