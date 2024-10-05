import { Invoice } from '@/definitions';
import { prisma } from '@/lib/prisma';
import { invoiceMapper } from '@/lib/mappers/invoiceMapper';

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
      include: { customer: true },
    });

    return invoices.map((invoice) => invoiceMapper(invoice));
  }

  async update(id: number, data: Partial<Invoice>): Promise<Invoice> {
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        canceledAt: data.canceledAt,
        paidAt: data.paidAt,
        status: data.status,
        total: data.total,
      },
      include: {
        customer: true,
      },
    });

    return invoiceMapper(updatedInvoice);
  }
}
