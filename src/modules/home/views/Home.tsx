import { component$, useStylesScoped$, useContext } from "@builder.io/qwik";
import homeStyles from '../styles/home.css?inline'
import { HomeCtxId } from "~/routes";
import { Notification } from "../components/Notification";
import { LastInvoices } from '../components/LastInvoices';

export const Home = component$(() => {

    const { notifications, lastInvoices } = useContext(HomeCtxId)

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
                <LastInvoices lastInvoices={lastInvoices} />
            </article>
            <article class='stock-alert'>
                <p>Alerta de stock</p>
            </article>
        </section>
    )
})
