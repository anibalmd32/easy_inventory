import type { InvoiceItem, NotificationData } from "./data";

export interface HomeLoaderProps {
    notificationsData: NotificationData[];
    lastInvoicesData: InvoiceItem[];
}

export interface HomeCtxProps {
    notifications: NotificationData[];
    lastInvoices: InvoiceItem[];
}

export interface HomeRootProps {}
