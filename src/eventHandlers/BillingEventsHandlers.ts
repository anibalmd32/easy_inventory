import {
  cancelInvoice,
  payInvoice,
} from '@/core/frameworks/server-actions/invoice.actions';
import ToastEventHandlers from './ToastEventHandlers';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface EventHandlerDeps {
  toastEvents: ToastEventHandlers;
  router: AppRouterInstance;
}

export default class BillingEventHandlers {
  constructor(private deps: EventHandlerDeps) {}

  onPayInvoice = async (id: number) => {
    this.deps.toastEvents.trigger({
      title: 'Cargando',
      description: 'Procesando pago de la factura',
    });

    try {
      await payInvoice(id);

      this.deps.toastEvents.trigger({
        title: 'Éxito',
        description: 'Factura pagada con éxito',
      });

      this.deps.router.refresh();
    } catch (error) {
      this.deps.toastEvents.error({
        title: 'Error',
        description: 'Error al pagar la factura',
      });
    }
  };

  onCancelInvoice = async (id: number) => {
    this.deps.toastEvents.trigger({
      title: 'Cargando',
      description: 'Procesando la cancelación de la factura',
    });

    try {
      await cancelInvoice(id);

      this.deps.toastEvents.trigger({
        title: 'Éxito',
        description: 'La factura se ha cancelado con éxito',
      });

      this.deps.router.refresh();
    } catch (error) {
      this.deps.toastEvents.error({
        title: 'Error',
        description: 'Error al cancelar la factura',
      });
    }
  };
}
