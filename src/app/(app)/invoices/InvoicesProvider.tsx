'use client';
import { createContext, useState } from 'react';
import { Invoice, LoadingData } from '@/definitions';
import { loaderInitialState } from '@/lib/utils';
import InvoiceEventsHandlers from '@/eventHandlers/InvoiceEventsHandlers';

interface InvoiceCtx {
  invoices: Invoice[];
  invoiceEvents: InvoiceEventsHandlers;
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

  const invoiceEvents = new InvoiceEventsHandlers();

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        invoiceEvents,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};
