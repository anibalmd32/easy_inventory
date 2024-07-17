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
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia architecto hic consectetur ipsum accusantium autem debitis fugiat vel, ipsam veniam quam sunt aut reprehenderit quae facilis quia nihil! Nisi, corporis!
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis non perspiciatis itaque magnam doloribus nobis commodi iure modi vero quam quibusdam neque mollitia quaerat hic, beatae esse odio aperiam pariatur.
                </p>
            </article>
            <article class='stock-alert'>
                <p>Alerta de stock</p>
            </article>
        </section>
    )
})
