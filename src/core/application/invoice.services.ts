import { Cart, Customer, Invoice, INVOICE_STATUS } from '@/definitions';
import InvoiceRepository from '../infrastructure/invoice.repository';
import SaleServices from './sale.services';
import SaleRepository from '../infrastructure/sale.repository';
import CustomerServices from './customer.services';
import CustomerRepository from '../infrastructure/customer.repository';
import ProductRepository from '../infrastructure/product.repository';
import ProductService from './product.services';
import { chromium } from 'playwright';

const customerServices = new CustomerServices(new CustomerRepository());
const salesServices = new SaleServices(new SaleRepository());
const productService = new ProductService(new ProductRepository());

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

    if (!customer.id || customer.id === 0) {
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

  async payInvoice(id: number) {
    const invoice = await this.repository.getById(id);

    await Promise.all(
      invoice.items.map(async item => {
        await productService.decrementProduct(
          item.sale.productId,
          item.sale.productQuantity
        );
      })
    );

    return await this.repository.update(id, {
      paidAt: new Date().toDateString(),
      status: INVOICE_STATUS.PAID,
    });
  }

  async cancelInvoice(id: number) {
    return await this.repository.update(id, {
      canceledAt: new Date().toDateString(),
      status: INVOICE_STATUS.CANCELED
    });
  }

  async getInvoiceList(): Promise<Invoice[]> {
    return await this.repository.getList();
  }

  async printInvoice(id: number) {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000'; // URL por defecto en desarrollo
    const browser = await chromium.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
        '--disable-accelerated-2d-canvas',
      ],
      headless: true
    });
  
    const page = await browser.newPage();
    await page.goto(`${baseURL}/print/${id}`); // Usar la URL dinámica
  
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
  
    return pdfBuffer;
  }
}
