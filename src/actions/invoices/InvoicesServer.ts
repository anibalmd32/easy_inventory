'use server'
import { Invoice, Cart, Customer, INVOICE_STATUS } from "@/definitions";
import { invoicesMock, customersMock, saleToCustomersMock, salesMock } from "../invoices/invoices.mock"

export async function getInvoices() {
  return invoicesMock
}

export async function getInvoiceById(id: number): Promise<Invoice> {
  try {
    const foundInvoice = invoicesMock.find(invoice => invoice.id === id);

    if (!foundInvoice) {
      throw new Error(`La factura con ${id} no existe`)
    }

    return foundInvoice;
  } catch (err) {
    return {} as Invoice
  }
}

export async function generateInvoice(cart: Cart, customer: Customer): Promise<Invoice> {
  try {
    const newInvoice: Invoice = {
      id: invoicesMock.length + 1,
      customerName: cart.customerName,
      generatedAt: new Date().toLocaleDateString(),
      items: cart.items.map(item => ({
        id: customersMock.length + 1,
        customer,
        customerId: customer.id,
        sale: {
          id: salesMock.length + 1,
          product: item,
          productId: item.id,
          productQuantity: item.amount,
        },
        saleId: salesMock.length + 1,
      })),
      status: INVOICE_STATUS.PENDING,
      total: String(cart.total),
    }

    invoicesMock.push(newInvoice);

    return newInvoice;
  } catch (error) {
    return {} as Invoice;
  }
}
