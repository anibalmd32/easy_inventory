'use client';

import { DataTable } from '@/components/shared/DataTable';
import { categoriesTableColumns } from './CategoriesTableColmuns';
import { Category } from '@prisma/client';

const mockCategories: Category[] = [
  {
    id: 1,
    color: '#b01010',
    name: 'Categoria 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    color: '#2bb010',
    name: 'Categoria 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    color: '#106db0',
    name: 'Categoria 3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    color: '#b01091',
    name: 'Categoria 4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const CategoriesTable = () => {
  return (
    <DataTable
      columns={categoriesTableColumns}
      data={mockCategories}
      filterColumn="name"
    />
  );
};
export default CategoriesTable;
