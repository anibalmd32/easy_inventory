export interface NotificationData {
    id: number | string;
    typeAction: 'add' | 'remove' | 'update' | 'sell';
    date: string;
    text: string;
}
