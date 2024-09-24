'use client';
import { createContext, useState } from 'react';
import { Invoice, LoadingData } from '@/definitions';
import LoaderOperations from '@/operations/LoaderOperations';
import { loaderInitialState } from '@/lib/utils';

interface InvoiceCtx {
  loaderOperations: LoaderOperations;
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

  const loaderOperations = new LoaderOperations(setLoadingData);

  return (
    <InvoicesContext.Provider
      value={{
        loaderOperations,
        invoices,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};
