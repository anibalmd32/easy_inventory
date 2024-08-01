import { component$, useStylesScoped$ } from "@builder.io/qwik";
import lastInvoiceStyle from '../styles/last-invoice.css?inline'
import type { InvoiceItem } from "../definitions/data";

export interface LastInvoicesProps {
    lastInvoices: InvoiceItem[]
}

export const LastInvoices = component$<LastInvoicesProps>(({ lastInvoices }) => {
    useStylesScoped$(lastInvoiceStyle)

    const invoicesItemDesign: {[key: string]: { color: string, text: string }} = {
        'paid': {
            color: '#b6ddff',
            text: 'Pagada'
        },
        'canceled': {
            color: '#ffc5c5',
            text: 'Cancelada'
        },
        'pending': {
            color: '#ffd8b8',
            text: 'Pendiente'
        },
    }

    return (
        <div class='last-invoices'>
            <h2>Ultimas Facturas</h2>

            {lastInvoices.length > 0 ? (
                <ul class='items-container'>
                    {lastInvoices.map(invoice => (
                        <li key={invoice.id} class='item'>
                            <div>
                                <span class='total'> ${invoice.total} </span>
                                <span
                                    class='status'
                                    style={{color: `${invoicesItemDesign[invoice.status].color}`}}
                                >
                                    {invoicesItemDesign[invoice.status].text}
                                </span>
                            </div>
                            <div>
                                <span class='customer'> {invoice.customerName} </span>
                                <span class='date'> {invoice.date} </span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay Facturas</p>
            )}
        </div>
    )
})
