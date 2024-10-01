'use server';

import CategoryRepository from '@/core/infrastructure/category.repository';
import CategoryService from '@/core/application/category.services';
import { Category } from '@/definitions';

const service = new CategoryService(new CategoryRepository());

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    return await service.getCategoryList();
  } catch (error) {
    console.error(error);
    return [];
  }
};
