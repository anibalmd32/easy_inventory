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

export const getInvoiceById = async (
  id: number,
): Promise<Invoice & { price: number | null }> => {
  try {
    const dolarRes = await fetch(
      'https://pydolarve.org/api/v1/dollar?page=bcv',
    );
    const dolarData = await dolarRes.json();
    const { price } = dolarData.monitors['usd'];

    const result = await service.getInvoiceById(id);

    return {
      ...result,
      price: price ?? null,
    };
  } catch (error) {
    console.log(error);
    return {} as Invoice & { price: number | null };
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
  return await service.getInvoiceList();
};

export const printInvoice = async (id: number) => {
  try {
    const pdf = await service.printInvoice(id);
    return pdf;
  } catch (error) {
    console.log(error);
  }
};
