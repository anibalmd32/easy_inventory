import { useToast } from '@/components/hooks/use-toast';
import BillingEventHandlers from '@/eventHandlers/BillingEventsHandlers';
import ToastEventHandlers from '@/eventHandlers/ToastEventHandlers';
import { useRouter } from 'next/navigation';

export default function useBillingActions() {
  const router = useRouter();
  const toastEvents = new ToastEventHandlers({ toast: useToast().toast });
  const billingEvents = new BillingEventHandlers({ toastEvents, router });

  return {
    billingEvents,
  };
}
