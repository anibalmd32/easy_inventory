import { Invoice, INVOICE_STATUS } from '@/definitions';
import { prisma } from '@/lib/prisma';
import { invoiceMapper } from '@/lib/mappers/invoiceMapper';
import { Prisma } from '@prisma/client';
import ProductRepository from './product.repository';

const productRepository = new ProductRepository();

export default class InvoiceRepository {
  async add(customerId: number, data: Invoice): Promise<Invoice> {
    const { generatedAt, items, status, total, canceledAt, paidAt } = data;

    const newInvoice = await prisma.invoice.create({
      data: {
        items: JSON.stringify(items),
        status: Number(status),
        total,
        canceledAt: canceledAt ? new Date(canceledAt) : null,
        generatedAt: new Date(generatedAt),
        paidAt: paidAt ? new Date(paidAt) : null,
        customer: {
          connect: {
            id: customerId,
          },
        },
      },
      include: {
        customer: true,
      },
    });

    return invoiceMapper(newInvoice);
  }

  async delete(id: number): Promise<Invoice> {
    const deletedInvoice = await prisma.invoice.delete({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    });

    return invoiceMapper(deletedInvoice);
  }

  async getById(id: number): Promise<Invoice> {
    const invoice = await prisma.invoice.findFirst({
      where: { id },
      include: {
        customer: true,
      },
    });

    return invoiceMapper(invoice);
  }

  async getList(): Promise<Invoice[]> {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mappedInvoices = invoices.map((invoice) => invoiceMapper(invoice));

    const remappedInvoices = await Promise.all(
      mappedInvoices.map(async (invoice) => {
        const mappedItems = invoice.items.map(async (item) => {
          const { productId } = item.sale;
          const currentProductQuantity =
            await productRepository.getQuantityByProductId(productId);

          return {
            ...item,
            sale: {
              ...item.sale,
              currentProductQuantity,
            },
          };
        });

        return {
          ...invoice,
          items: await Promise.all(mappedItems),
        };
      }),
    );

    return remappedInvoices;
  }

  async update(id: number, invoiceData: Partial<Invoice>): Promise<Invoice> {
    const data: Prisma.InvoiceUpdateInput = {};

    if (invoiceData.canceledAt) {
      data.canceledAt = new Date(invoiceData.canceledAt);
    }

    if (invoiceData.paidAt) {
      data.paidAt = new Date(invoiceData.paidAt);
    }

    if (invoiceData.status) {
      data.status = invoiceData.status;
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data,
      include: {
        customer: true,
      },
    });

    return invoiceMapper(updatedInvoice);
  }
}
