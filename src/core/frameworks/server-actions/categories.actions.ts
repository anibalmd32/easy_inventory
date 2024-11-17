'use server';

import CategoryRepository from '@/core/infrastructure/category.repository';
import CategoryService from '@/core/application/category.services';
import { Category } from '@/definitions';

const service = new CategoryService(new CategoryRepository());

export const getAllCategoriesAction = async (): Promise<Category[]> => {
  try {
    return await service.getCategoryList();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createCategoryAction = async (
  newCategory: Category,
): Promise<void> => {
  try {
    await service.createNewCategory(newCategory);
  } catch (error) {
    console.error(error);
  }
};

export const updateCategoryAction = async (
  data: Partial<Category>,
  id: number,
): Promise<void> => {
  try {
    await service.updatePartiallyCategory(id, data);
  } catch (error) {
    console.error(error);
  }
};

export const deleteCategoryAction = async (id: number): Promise<void> => {
  try {
    await service.deleteCategory(id);
  } catch (error) {
    console.error(error);
  }
};
