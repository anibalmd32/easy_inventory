'use client';

import { Button } from '@/components/ui/button';
import useBillingActions from './useBillingActions';
import { INVOICE_STATUS } from '@/definitions';
import { Printer } from 'lucide-react';

const CancelBtn = ({ invoiceId }: { invoiceId: number }) => {
  const { billingEvents } = useBillingActions();

  return (
    <Button
      onClick={async () => await billingEvents.onCancelInvoice(invoiceId)}
      className="bg-transparent border border-red-400 hover:bg-red-400 hover:text-gray-200 text-gray-200 transition-all duration-300"
    >
      Cancelar
    </Button>
  );
};

const PayBtn = ({ invoiceId }: { invoiceId: number }) => {
  const { billingEvents } = useBillingActions();

  return (
    <Button
      onClick={async () => await billingEvents.onPayInvoice(invoiceId)}
      className="bg-gray-900 hover:bg-gray-800 text-gray-200 transition-all duration-300"
    >
      Pagar
    </Button>
  );
};

const PrintBtn = ({ invoiceId }: { invoiceId: number }) => {
  const { invoiceEvents } = useBillingActions();

  return (
    <Button
      onClick={async () => await invoiceEvents.onPrintInvoice(invoiceId)}
      variant="outline"
      className="text-sm w-full flex gap-2 items-center bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
    >
      <Printer />
      Imprimir
    </Button>
  );
};

export default function GeneratedInvoiceBtns({
  invoiceId,
  invoiceStatus,
}: {
  invoiceId: number;
  invoiceStatus: INVOICE_STATUS;
}) {
  return (
    <div>
      <div className="flex justify-end gap-2 mb-2">
        {invoiceStatus === INVOICE_STATUS.PENDING && (
          <>
            <CancelBtn invoiceId={invoiceId} />
            <PayBtn invoiceId={invoiceId} />
          </>
        )}
        {invoiceStatus === INVOICE_STATUS.PAID && (
          <>
            <CancelBtn invoiceId={invoiceId} />
          </>
        )}
      </div>

      <PrintBtn invoiceId={invoiceId} />
    </div>
  );
}
