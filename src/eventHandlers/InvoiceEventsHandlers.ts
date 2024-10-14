import { printInvoice } from '@/core/frameworks/server-actions/invoice.actions';

export default class InvoiceEventsHandlers {
  onPrintInvoice = async (invoiceId: number) => {
    const pdfBuffer = await printInvoice(invoiceId);

    if (pdfBuffer) {
      const unit8Array = new Uint8Array(pdfBuffer);
      const blob = new Blob([unit8Array], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      window.open(url);
    }
  };
}
