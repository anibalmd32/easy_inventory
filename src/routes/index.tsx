/** QWIK IMPORTS */
import { component$, createContextId, useContextProvider } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'

/** DEFINITIONS */
import type { HomeCtxProps, HomeLoaderProps } from "~/modules/home/definitions";
import type { NotificationData } from "~/modules/home/definitions";

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

    return {
        notificationsData: notifications
    }
})

/** CONEXT ID */
export const HomeCtxId = createContextId<HomeCtxProps>('home-module')

/** PAGE */
export default component$(() => {
    const { value: homeData } = useHomeData()

    useContextProvider(HomeCtxId, {
        notifications: homeData.notificationsData
    })

    return <Home />
})

/** PAGE METADATA */
export const head: DocumentHead = {
    title: 'Inicio'
}
