import { printInvoice } from '@/core/frameworks/server-actions/invoice.actions';

export default class InvoiceEventsHandlers {
  onPrintInvoice = async () => {
    await printInvoice();
  };
}
