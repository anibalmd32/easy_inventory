import { Invoice, SaleToCustomer } from '@/definitions';

export function invoiceMapper(invoiceData: any): Invoice {
  return {
    ...invoiceData,
    total: Number(invoiceData.total),
    items: JSON.parse(String(invoiceData.items)) as SaleToCustomer[],
    customerName: invoiceData.customer.name,
    generatedAt: invoiceData.generatedAt.toDateString(),
    paidAt: invoiceData.paidAt?.toDateString(),
    canceledAt: invoiceData.canceledAt?.toDateString(),
  };
}
