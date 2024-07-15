/** QWIK IMPORTS */
import { component$, createContextId, useContextProvider } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'

/** DEFINITIONS */
import type { SettingsCtxProps, SettingsLoaderProps } from "~/modules/settings/definitions";

/** VIEWS */
import { Settings } from "~/modules/settings/views";

/** ROUTER LOADER */
export const useHomeData = routeLoader$(async (): Promise<SettingsLoaderProps> => {
    return {} as SettingsLoaderProps
})

/** CONEXT ID */
export const settingsCtxId = createContextId<SettingsCtxProps>('settings-module')

/** PAGE */
export default component$(() => {
    const data = useHomeData()
    useContextProvider(settingsCtxId, data)

    return <Settings />
})

/** PAGE METADATA */
export const head: DocumentHead = {
    title: 'Configuraciones'
}
