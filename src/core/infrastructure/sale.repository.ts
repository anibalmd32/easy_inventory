import { AppRepository } from '../domain/app.domain';
import { SaleToCustomer, Sale } from '@/definitions';
import { prisma } from '@/lib/prisma';

export default class SaleRepository {
  async add(customerId: number, data: Sale): Promise<Sale> {
    const newSale = await prisma.sale.create({
      data: {
        productQuantity: data.productQuantity,
        product: {
          connect: {
            id: data.productId,
          },
        },
        salesToCustomers: {
          create: {
            customerId,
          },
        },
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return {
      ...newSale,
      product: {
        ...newSale.product,
        price: Number(newSale.product.price)
      }
    };
  }

  async delete(id: number): Promise<Sale> {
    return {} as Sale;
  }

  async getById(id: number): Promise<Sale> {
    return {} as Sale;
  }

  async getList(): Promise<Sale[]> {
    return [] as Sale[];
  }

  async update(id: number, data: Partial<Sale>): Promise<Sale> {
    return {} as Sale;
  }
}
