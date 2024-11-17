'use client';

import { DataTable } from '@/components/shared/DataTable';
import { categoriesTableColumns } from './CategoriesTableColmuns';
import useCategories from '../../hooks/useCategories';
import Spinner from '@/components/shared/Spinner/Spinner';

const CategoriesTable = () => {
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
