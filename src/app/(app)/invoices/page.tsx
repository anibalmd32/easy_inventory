import { Invoice } from '@/definitions';
import { InvoicesProvider } from './InvoicesProvider';
import { InvoicesTable } from './components/InvoicesTable/InvoicesTable';
import { PageTitle } from '@/components/shared/PageTitle';

export const revalidate = 0;

export default async function InvoicesPage() {
  const invoices = [] as Invoice[];

  return (
    <InvoicesProvider initialInvoices={invoices}>
      <div>
        <PageTitle>Facturas</PageTitle>
        <InvoicesTable />
      </div>
    </InvoicesProvider>
  );
}
