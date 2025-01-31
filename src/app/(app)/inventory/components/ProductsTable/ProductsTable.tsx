'use client';
import { useInventory } from '../../InventoryProvider';
import { DataTable } from '@/components/shared/DataTable';
import { productsTableColumns } from './productsTableColumns';
import { useDolarStore } from '@/store/dolarStore';
import { useEffect } from 'react';

export function ProductsTable() {
  const { products } = useInventory();
  const { getDolarPrice, price } = useDolarStore();

  useEffect(() => {
    getDolarPrice();
  }, [getDolarPrice]);

  return (
    <div>
      <DataTable
        columns={productsTableColumns(price)}
        data={products}
        filterColumn="name"
      />
    </div>
  );
}
