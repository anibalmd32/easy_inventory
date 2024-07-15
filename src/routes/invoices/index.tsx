/** QWIK IMPORTS */
import { component$, createContextId, useContextProvider } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'

/** DEFINITIONS */
import type { InvoicesCtxProps, InvoicesLoaderProps } from "~/modules/invoices/definitions";

/** VIEWS */
import { Invoice } from "~/modules/invoices/views";

/** ROUTER LOADER */
export const useHomeData = routeLoader$(async (): Promise<InvoicesLoaderProps> => {
    return {} as InvoicesLoaderProps
})

/** CONEXT ID */
export const invoicesCtxId = createContextId<InvoicesCtxProps>('invoices-module')

/** PAGE */
export default component$(() => {
    const data = useHomeData()
    useContextProvider(invoicesCtxId, data)

    return <Invoice />
})

/** PAGE METADATA */
export const head: DocumentHead = {
    title: 'Facturas'
}
