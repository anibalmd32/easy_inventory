import { InvoicesProvider } from "./context/InvoicesProvider"
import { invoicesMock } from "./components/InvoicesTable/invoicesMock"
import { InvoicesTable } from "./components/InvoicesTable/InvoicesTable"

export default function InvoicesPage() {
	return (
		<InvoicesProvider initialInvoices={invoicesMock}>
			<div>
				<h2 className='text-gray-200 font-bold text-3xl'>Facturas</h2>

				<InvoicesTable />
			</div>
		</InvoicesProvider>
	)
}
