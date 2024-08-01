export interface NotificationData {
    id: number | string;
    typeAction: 'add' | 'remove' | 'update' | 'sell';
    date: string;
    text: string;
}

export interface InvoiceItem {
    id: number | string;
    customerName: string;
    date: string;
    status: 'paid' | 'pending' | 'canceled';
    total: string;
}
