'use client';
import { useCallback, useEffect, useState } from 'react';

import {
  fetchCategoriesCommand,
  addCategoryCommand,
  removeCategoryCommand,
  updateCategoryCommand,
} from '../commands/categoryCommands';
import { Category } from '@/definitions';
import { useCategoryForm } from './useCategoryForm';

export type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

const useCategories = () => {
  const [categoryState, setCategoryState] = useState<CategoryState>({
    categories: [],
    loading: true,
    error: null,
  });

  const [defaultFormValues, setDefaultFormValues] = useState<Category>({
    id: 0,
    name: '',
    color: '',
  });

  const { form, onSubmit, openForm, toggleForm } =
    useCategoryForm(defaultFormValues);

  const initCategories = useCallback(async () => {
    if (categoryState.categories.length <= 0 && categoryState.loading) {
      await fetchCategoriesCommand(categoryState, setCategoryState);
    }
  }, [categoryState]);

  const addCategory = useCallback(
    async (data: Category) => {
      await addCategoryCommand(categoryState, setCategoryState, data);
    },
    [categoryState],
  );

  const removeCategory = useCallback(
    async (data: Category) => {
      await removeCategoryCommand(categoryState, setCategoryState, data);
    },
    [categoryState],
  );

  const updateCategory = useCallback(
    async (data: Category) => {
      await updateCategoryCommand(categoryState, setCategoryState, data);
    },
    [categoryState],
  );

  useEffect(() => {
    initCategories();
  }, [initCategories]);

  return {
    categoryState,
    addCategory,
    removeCategory,
    updateCategory,
    form,
    openForm,
    toggleForm,
    onSubmit,
    setDefaultFormValues,
  };
};

export default useCategories;
