import { InvoicesProvider } from "./InvoicesProvider"
import { InvoicesTable } from "./components/InvoicesTable/InvoicesTable"
import { getInvoices } from "@/actions/invoices/InvoicesServer"
import { PageTitle } from "@/components/shared/PageTitle"

export default async function InvoicesPage() {
	const invoices = await getInvoices()

	return (
		<InvoicesProvider initialInvoices={invoices}>
			<div>
				<PageTitle>Facturas</PageTitle>
				<InvoicesTable />
			</div>
		</InvoicesProvider>
	)
}
