'use client';

import { DataTable } from '@/components/shared/DataTable';
import { categoriesTableColumns } from './CategoriesTableColumns';
import { useSettings } from '../../../hooks/useSettings';

const CategoriesTable = () => {
  const { useCategories } = useSettings();
  const { categoryState } = useCategories();

  return (
    <DataTable
      columns={categoriesTableColumns}
      data={categoryState.categories}
      filterColumn="name"
      loading={categoryState.loading}
    />
  );
};

export default CategoriesTable;
