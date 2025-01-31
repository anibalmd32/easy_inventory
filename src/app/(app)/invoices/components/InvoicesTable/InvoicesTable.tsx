'use client';
import { DataTable } from '@/components/shared/DataTable';
import { invoicesTableColumns } from './invoicesTableColumns';
import { useInvoices } from '../../hooks/useInvoices';
import { useDolarStore } from '@/store/dolarStore';

export function InvoicesTable() {
  const { invoices } = useInvoices();
  const { price } = useDolarStore();

  return (
    <div>
      <DataTable
        columns={invoicesTableColumns(price)}
        data={invoices}
        filterColumn="customerName"
      />
    </div>
  );
}
