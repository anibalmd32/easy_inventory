'use client';
import { useContext } from 'react';
import { InvoicesContext } from '../InvoicesProvider';

export const useInvoices = () => useContext(InvoicesContext);
