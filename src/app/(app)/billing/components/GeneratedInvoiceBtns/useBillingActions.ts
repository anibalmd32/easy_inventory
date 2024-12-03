import { useToast } from '@/components/hooks/use-toast';
import BillingEventHandlers from '@/eventHandlers/BillingEventsHandlers';
import ToastEventHandlers from '@/eventHandlers/ToastEventHandlers';
import { useRouter } from 'next/navigation';
import InvoiceEventHandlers from '@/eventHandlers/InvoiceEventsHandlers';

export default function useBillingActions() {
  const router = useRouter();
  const toastEvents = new ToastEventHandlers({ toast: useToast().toast });
  const billingEvents = new BillingEventHandlers({ toastEvents, router });
  const invoiceEvents = new InvoiceEventHandlers({ toastEvents });

  return {
    billingEvents,
    invoiceEvents,
  };
}
