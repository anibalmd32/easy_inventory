import { Cart, Customer, Invoice, INVOICE_STATUS } from '@/definitions';
import InvoiceRepository from '../infrastructure/invoice.repository';
import SaleServices from './sale.services';
import SaleRepository from '../infrastructure/sale.repository';
import CustomerServices from './customer.services';
import CustomerRepository from '../infrastructure/customer.repository';

const customerServices = new CustomerServices(new CustomerRepository());
const salesServices = new SaleServices(new SaleRepository());

export default class InvoiceServices {
  constructor(private readonly repository: InvoiceRepository) {}

  async createInvoice(cart: Cart, customer: Customer): Promise<Invoice> {
    const newInvoice: Invoice = {
      customerName: customer.name,
      generatedAt: new Date().toLocaleDateString(),
      id: 0,
      items: [],
      status: INVOICE_STATUS.PENDING,
      total: String(cart.total),
    };

    if (!customer.id) {
      customer = await customerServices.createNewCustomer(customer);
    }

    await Promise.all(
      cart.items.map(async (item) => {
        const newSale = await salesServices.createNewSale(customer.id, {
          id: 0,
          product: item,
          productId: item.id,
          productQuantity: item.amount,
        });

        newInvoice.items.push({
          customer: customer,
          customerId: customer.id,
          sale: newSale,
          saleId: newSale.id,
          id: 0,
        });
      })
    );

    return await this.repository.add(customer.id, newInvoice);
  }

  async getInvoiceById(id: number) {
    return await this.repository.getById(id);
  }
}
