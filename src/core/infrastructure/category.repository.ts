import type { AppRepository } from '../domain/app.domain';
import type { Category } from '@/definitions';
import { prisma } from '@/lib/prisma';

export default class CategoryRepository implements AppRepository<Category> {
  async add(data: Category): Promise<Category> {
    const newCategory = await prisma.category.create({ data });

    return newCategory;
  }

  async delete(id: number): Promise<Category> {
    const deletedCategory = await prisma.category.delete({ where: { id } });

    return deletedCategory;
  }

  async getById(id: number): Promise<Category> {
    const category = await prisma.category.findFirst({ where: { id } });

    return category ?? ({} as Category);
  }

  async getList(): Promise<Category[]> {
    const categories = await prisma.category.findMany();

    return categories;
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    return updatedCategory;
  }
}
