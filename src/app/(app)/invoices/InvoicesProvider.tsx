'use client';
import { createContext, useState } from 'react';
import { Invoice, LoadingData } from '@/definitions';
import { loaderInitialState } from '@/lib/utils';

interface InvoiceCtx {
  invoices: Invoice[];
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

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};
