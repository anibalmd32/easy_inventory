'use client';
import { createContext, useState } from 'react';
import { Invoice, LoadingData } from '@/definitions';
import { loaderInitialState } from '@/lib/utils';
import InvoiceEventsHandlers from '@/eventHandlers/InvoiceEventsHandlers';
import ToastEventHandlers from '@/eventHandlers/ToastEventHandlers';
import { useToast } from '@/components/hooks/use-toast';
import BillingEventsHandlers from '@/eventHandlers/BillingEventsHandlers';
import { useRouter } from 'next/navigation';

interface InvoiceCtx {
  invoices: Invoice[];
  invoiceEvents: InvoiceEventsHandlers;
  billingEvents: BillingEventsHandlers;
}

interface InvoicesProviderProps {
  children: React.ReactNode;
  initialInvoices: Invoice[];
}

export const InvoicesContext = createContext<InvoiceCtx>({} as InvoiceCtx);

export const InvoicesProvider = ({
  children,
  initialInvoices,
}: InvoicesProviderProps) => {
  const [loadingData, setLoadingData] =
    useState<LoadingData>(loaderInitialState);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const { toast } = useToast();
  const router = useRouter();
  const toastEvents = new ToastEventHandlers({ toast });

  const invoiceEvents = new InvoiceEventsHandlers({
    toastEvents,
  });

  const billingEvents = new BillingEventsHandlers({
    toastEvents,
    router,
  });

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        invoiceEvents,
        billingEvents,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};
