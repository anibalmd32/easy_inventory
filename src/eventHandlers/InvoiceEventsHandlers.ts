import { printInvoice } from '@/core/frameworks/server-actions/invoice.actions';
import ToastEventHandlers from './ToastEventHandlers';

interface EventHandlerDeps {
  toastEvents: ToastEventHandlers;
}

export default class InvoiceEventsHandlers {
  private deps: EventHandlerDeps;

  constructor(deps: EventHandlerDeps) {
    this.deps = deps;
  }

  onPrintInvoice = async (invoiceId: number) => {
    this.deps.toastEvents.trigger({
      title: 'Generando factura',
      description: 'La factura se esta generando. Espere un momento'
    });

    try {
      const pdfBuffer = await printInvoice(invoiceId);
  
      if (pdfBuffer) {
        const unit8Array = new Uint8Array(pdfBuffer);
        const blob = new Blob([unit8Array], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
  
        window.open(url);
      }
      
      this.deps.toastEvents.trigger({
        title: 'Factura generada',
      });
    } catch (error: any) {
      this.deps.toastEvents.trigger({
        title: 'Error al generar factura',
        description: error.message
      });
    }
  };
}
