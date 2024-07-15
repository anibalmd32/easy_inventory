/** QWIK IMPORTS */
import { component$, createContextId, useContextProvider } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'

/** DEFINITIONS */
import type { InventoryCtxProps, InventoryLoaderProps } from "~/modules/inventory/definitions";

/** VIEWS */
import { Inventory } from "~/modules/inventory/views";

/** ROUTER LOADER */
export const useHomeData = routeLoader$(async (): Promise<InventoryLoaderProps> => {
    return {} as InventoryLoaderProps
})

/** CONEXT ID */
export const inventoryCtxId = createContextId<InventoryCtxProps>('inventory-module')

/** PAGE */
export default component$(() => {
    const data = useHomeData()
    useContextProvider(inventoryCtxId, data)

    return <Inventory />
})

/** PAGE METADATA */
export const head: DocumentHead = {
    title: 'Inventario'
}
