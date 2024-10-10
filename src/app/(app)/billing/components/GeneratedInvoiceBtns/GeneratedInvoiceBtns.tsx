'use client';

import { Button } from '@/components/ui/button';
import useBillingActions from './useBillingActions';

export default function GeneratedInvoiceBtns({ invoiceId }: { invoiceId: number }) {
  const { billingEvents } = useBillingActions();
  
  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={async () => await billingEvents.onCancelInvoice(invoiceId)}
        className="bg-transparent border border-red-400 hover:bg-red-400 hover:text-gray-200 text-gray-200 transition-all duration-300"
      >
        Cancelar
      </Button>
      <Button
        onClick={async () => await billingEvents.onPayInvoice(invoiceId)}
        className="bg-gray-900 hover:bg-gray-800 text-gray-200 transition-all duration-300"
      >
        Pagar
      </Button>
    </div>
  );
}
