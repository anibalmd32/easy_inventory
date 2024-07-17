import { component$, useStylesScoped$ } from "@builder.io/qwik";
import homeStyles from '../styles/home.css?inline'

export const Home = component$(() => {

    useStylesScoped$(homeStyles)
    return (
        <section class='home'>
            <article class='notifications'>
                <p>Notificaciones</p>
            </article>
            <article class='stacks'>
                <p>Estidisticas</p>
            </article>
            <article class='last-invoices'>
                <p>Ultimas facturas</p>
            </article>
            <article class='stock-alert'>
                <p>Alerta de stock</p>
            </article>
        </section>
    )
})
