/** QWIK IMPORTS */
import { component$, createContextId, useContextProvider } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'

/** DEFINITIONS */
import type { HomeCtxProps, HomeLoaderProps } from "~/modules/home/definitions/root";
import type { NotificationData, InvoiceItem } from "~/modules/home/definitions/data";

/** VIEWS */
import { Home } from "~/modules/home/views";

/** ROUTER LOADER */
export const useHomeData = routeLoader$(async (): Promise<HomeLoaderProps> => {
    const notifications: NotificationData[] = [
        {
            date: '01/02/2024',
            id: 1,
            text: 'Nueva factura generada',
            typeAction: 'add'
        },
        {
            date: '01/02/2024',
            id: 2,
            text: 'Producto removido',
            typeAction: 'remove'
        },
        {
            date: '01/02/2024',
            id: 3,
            text: 'Producto vendido',
            typeAction: 'sell'
        },
        {
            date: '01/02/2024',
            id: 4,
            text: 'Producto actualizado',
            typeAction: 'update'
        },
    ]

    const lastInvoices: InvoiceItem[] = [
        {
            id: 1,
            customerName: 'Jhon Doe',
            date: '01/02/2024',
            status: 'paid',
            total: '99.99'
        },
        {
            id: 2,
            customerName: 'Sam Smith',
            date: '01/02/2024',
            status: 'canceled',
            total: '99.99'
        },
        {
            id: 3,
            customerName: 'Noe Goodman',
            date: '01/02/2024',
            status: 'pending',
            total: '99.99'
        },
        {
            id: 4,
            customerName: 'George Castle',
            date: '01/02/2024',
            status: 'paid',
            total: '99.99'
        },
    ]

    return {
        notificationsData: notifications,
        lastInvoicesData: lastInvoices,
    }
})

/** CONEXT ID */
export const HomeCtxId = createContextId<HomeCtxProps>('home-module')

/** PAGE */
export default component$(() => {
    const { value: homeData } = useHomeData()

    useContextProvider(HomeCtxId, {
        notifications: homeData.notificationsData,
        lastInvoices: homeData.lastInvoicesData,
    })

    return <Home />
})

/** PAGE METADATA */
export const head: DocumentHead = {
    title: 'Inicio'
}
