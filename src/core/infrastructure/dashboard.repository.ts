import { INVOICE_STATUS, SaleReport, SaleToCustomer } from '@/definitions';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface Interval {
  start: Date;
  end: Date;
}

export default class DashboardRepository {
  async getTotalSalesByInterval({ end, start }: Interval): Promise<number> {
    const result = await prisma.invoice.aggregate({
      where: {
        status: INVOICE_STATUS.PAID,
        paidAt: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        total: true,
      },
    });

    return Number(result._sum.total) ?? 0;
  }

  async countCustomers({ end, start }: Partial<Interval>): Promise<number> {
    const query: Prisma.CustomerWhereInput = {};
    const createdAt: any = {};

    if (end) {
      createdAt.lte = end;
    }

    if (start) {
      createdAt.gte = start;
    }

    query.createdAt = createdAt;

    const result = await prisma.customer.count({ where: query });

    return result;
  }

  async countPaidInvoices({ end, start }: Partial<Interval>): Promise<number> {
    const createdAt: any = {};

    if (end) {
      createdAt.lte = end;
    }

    if (start) {
      createdAt.gte = start;
    }

    const result = await prisma.invoice.count({
      where: {
        status: INVOICE_STATUS.PAID,
        createdAt,
      },
    });

    return result;
  }

  async countSoldProducts({ end, start }: Partial<Interval>): Promise<number> {
    const paidAt: any = {};

    if (end) {
      paidAt.lte = end;
    }

    if (start) {
      paidAt.gte = start;
    }

    const result = await prisma.sale.aggregate({
      where: {
        salesToCustomers: {
          every: {
            customer: {
              invoices: {
                every: {
                  status: INVOICE_STATUS.PAID,
                  paidAt,
                },
              },
            },
          },
        },
      },
      _sum: {
        productQuantity: true,
      },
    });

    return result._sum.productQuantity ?? 0;
  }

  async countInvoicesPerInterval({ end, start }: Interval) {
    const paidInvoices = await prisma.invoice.count({
      where: {
        status: INVOICE_STATUS.PAID,
        paidAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const canceledInvoices = await prisma.invoice.count({
      where: {
        status: INVOICE_STATUS.CANCELED,
        canceledAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return {
      paidInvoices,
      canceledInvoices,
    };
  }

  async countInvoicesPerDate({ end, start }: Interval) {
    const paidInvoices = await prisma.invoice.count({
      where: {
        status: INVOICE_STATUS.PAID,
        paidAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const canceledInvoices = await prisma.invoice.count({
      where: {
        status: INVOICE_STATUS.CANCELED,
        canceledAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return {
      paidInvoices,
      canceledInvoices,
    };
  }

  async getSalesReport({ end, start }: Interval): Promise<SaleReport> {
    const startToDate = new Date(start);
    const endToDate = new Date(end);

    const startDate = new Date(
      startToDate.getFullYear(),
      startToDate.getMonth(),
      startToDate.getDate(),
    );
    const endDate = new Date(
      endToDate.getFullYear(),
      endToDate.getMonth(),
      endToDate.getDate(),
      23,
      59,
      59,
      999,
    );

    const invoiceWhere: Prisma.InvoiceWhereInput = {
      status: INVOICE_STATUS.PAID,
      paidAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const invoicesStats = await prisma.invoice.aggregate({
      where: invoiceWhere,
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    const invoicesItems = await prisma.invoice.findMany({
      where: invoiceWhere,
      select: {
        items: true,
      },
    });

    const salesItems = invoicesItems
      .map((invoice) => JSON.parse(String(invoice.items)) as SaleToCustomer[])
      .flat();

    return {
      totalPaidInvoices: invoicesStats._count.id,
      totalUSD: String(invoicesStats._sum.total),
      totalBS: '',
      items: salesItems,
    };
  }
}
