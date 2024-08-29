'use client'

import React from 'react';	
import { InvoiceCtx } from '../definitions/invoicesContext';
import { InvoiceData } from '../definitions/invoicesData';

export const InvoicesContext = React.createContext<InvoiceCtx>({} as InvoiceCtx);

export const InvoicesProvider = ({
	children,
	initialInvoices
}: {
		children: React.ReactNode,
		initialInvoices: InvoiceData[]
}) => {
	const [invoices, setInvoices] = React.useState<InvoiceData[]>(initialInvoices);

	return (
		<InvoicesContext.Provider value={{
			invoices,
		}}>
			{children}
		</InvoicesContext.Provider>
	);
};