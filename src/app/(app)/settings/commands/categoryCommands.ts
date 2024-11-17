import { Category } from '@/definitions';
import {
  createCategoryAction,
  deleteCategoryAction,
  getAllCategoriesAction,
  updateCategoryAction,
} from '@/core/frameworks/server-actions/categories.actions';
import { Dispatch } from 'react';
import { CategoryState } from '../hooks/useCategories';

export const fetchCategoriesCommand = async (
  state: CategoryState,
  setState: Dispatch<CategoryState>,
) => {
  try {
    const data = await getAllCategoriesAction();
    setState({ ...state, categories: data, loading: false });
  } catch (error: any) {
    setState({ ...state, error: error.message, loading: false });
  }
};

export const addCategoryCommand = async (
  state: CategoryState,
  setState: Dispatch<CategoryState>,
  data: Category,
) => {
  setState({ ...state, loading: true });
  try {
    const newCategoriesSate = [data, ...state.categories];
    setState({ ...state, categories: newCategoriesSate, loading: false });
    await createCategoryAction(data);
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

export const removeCategoryCommand = async (
  state: CategoryState,
  setState: Dispatch<CategoryState>,
  data: Category,
) => {
  setState({ ...state, loading: true });
  try {
    const filteredCategories = state.categories.filter(
      (item) => item.id !== data.id,
    );
    setState({ ...state, categories: [...filteredCategories], loading: false });
    await deleteCategoryAction(data.id);
  } catch (error) {}
};

export const updateCategoryCommand = async (
  state: CategoryState,
  setState: Dispatch<CategoryState>,
  data: Category,
) => {
  setState({ ...state, loading: true });
  try {
    const filteredCategories = state.categories.map((item) => {
      if (item.id === data.id) {
        return data;
      }
      return item;
    });
    setState({ ...state, categories: [...filteredCategories], loading: false });
    await updateCategoryAction(data, data.id);
  } catch (error) {}
};
