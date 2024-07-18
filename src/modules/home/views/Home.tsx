import { component$, useStylesScoped$, useContext } from "@builder.io/qwik";
import homeStyles from '../styles/home.css?inline'
import { HomeCtxId } from "~/routes";
import { Notification } from "../components/Notification";

export const Home = component$(() => {

    const { notifications } = useContext(HomeCtxId)

    useStylesScoped$(homeStyles)
    return (
        <section class='home'>
            <article class='notifications'>
                <Notification notifications={notifications} />
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
