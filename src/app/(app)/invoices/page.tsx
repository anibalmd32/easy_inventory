import { InvoicesProvider } from './InvoicesProvider';
import { InvoicesTable } from './components/InvoicesTable/InvoicesTable';
import { PageTitle } from '@/components/shared/PageTitle';
import { getInvoiceList } from '@/core/frameworks/server-actions/invoice.actions';

export const revalidate = 0;

export default async function InvoicesPage() {
  const invoices = await getInvoiceList();

  return (
    <InvoicesProvider initialInvoices={invoices}>
      <div>
        <PageTitle>Facturas</PageTitle>
        <InvoicesTable />
      </div>
    </InvoicesProvider>
  );
}
