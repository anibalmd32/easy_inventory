import { Prisma } from '@prisma/client';
import { Product } from '@/definitions';
import { IProductRepository } from '../domain/product.domain';
import { prisma } from '@/lib/prisma';

export default class ProductRepository {
  async add(product: Product): Promise<Product> {
    const productData: Prisma.ProductCreateInput = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };

    if (product.categoryId) {
      productData.category = {
        connect: {
          id: product.categoryId,
        },
      };
    }

    const newProduct = await prisma.product.create({
      data: productData,
      include: { category: true },
    });

    return {
      ...newProduct,
      price: Number(newProduct.price),
    };
  }

  async getList(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  }

  async getById(id: number): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    return {
      ...product!,
      price: Number(product!.price),
    };
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    const productData: Prisma.ProductUpdateInput = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };

    if (product.categoryId) {
      productData.category = {
        connect: {
          id: product.categoryId,
        },
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
      include: { category: true },
    });

    return {
      ...updatedProduct,
      price: Number(updatedProduct.price),
    };
  }

  async delete(id: number): Promise<Product> {
    const deletedProduct = await prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: { category: true },
    });

    return {
      ...deletedProduct,
      price: Number(deletedProduct.price),
    };
  }

  async decrementProductQuantity(id: number, quantity: number): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }

  async incrementProductQuantity(id: number, quantity: number): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }

  async getQuantityByProductId(id: number): Promise<number> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product?.quantity ?? 0;
  }
}
