import { InvoicesProvider } from "./context/InvoicesProvider"
import { invoicesMock } from "./components/InvoicesTable/invoicesMock"
import { TableContainer } from "./components/TableContainer"

export default function InvoicesPage() {
	return (
		<InvoicesProvider initialInvoices={invoicesMock}>
			<div>
				<h2 className='text-gray-200 font-bold text-3xl'>Facturas</h2>

				<TableContainer />
			</div>
		</InvoicesProvider>
	)
}
