//* QWIK IMPORTS
import { component$, createContextId, useContextProvider } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'

//* DEFINITIONS
import type { HomeCtxProps, HomeLoaderProps } from "~/modules/home/definitions";

//* VIEWS
import { Home } from "~/modules/home/views";

//* ROUTER LOADER
export const useHomeData = routeLoader$(async (): Promise<HomeLoaderProps> => {
    return {} as HomeLoaderProps
})

//* CONEXT ID
export const homeCtxId = createContextId<HomeCtxProps>('home-module')

//* PAGE
export default component$(() => {
    const data = useHomeData()
    useContextProvider(homeCtxId, data)

    return <Home />
})

//* PAGE METADATA
export const head: DocumentHead = {
    title: 'Inicio'
}
