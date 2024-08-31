import { InvoicesProvider } from "./InvoicesProvider"
import { InvoicesTable } from "./components/InvoicesTable/InvoicesTable"
import { InvoicesServer } from "@/actions/invoices/InvoicesServer"
import { PageTitle } from "@/components/shared/PageTitle"

export default async function InvoicesPage() {
	const invoicesServer = new InvoicesServer()
	const invoices = await invoicesServer.getInvoices()

	return (
		<InvoicesProvider initialInvoices={invoices}>
			<div>
				<PageTitle>Facturas</PageTitle>
				<InvoicesTable />
			</div>
		</InvoicesProvider>
	)
}
