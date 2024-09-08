import { PageTitle } from '@/components/shared/PageTitle'
import { getInvoiceById } from '@/actions/invoices/InvoicesServer'
import { Calendar, User, Loader, Printer } from 'lucide-react'
import { INVOICE_STATUS } from '@/definitions';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import * as ShadTable from "@/components/ui/table"

export default async function Page({ params }: { params: { id: string } }) {

  const invoice = await getInvoiceById(Number(params.id));
  const formattedDate = formatDate(new Date(invoice.generatedAt));

  const statusClass = {
    [INVOICE_STATUS.PAID]: 'bg-green-500',
    [INVOICE_STATUS.CANCELED]: 'bg-red-500',
    [INVOICE_STATUS.PENDING]: 'bg-yellow-500',
  };

  return (
    <div className='space-y-6'>
      <PageTitle>
        Detalles de la factura #{params.id}
      </PageTitle>

      {/* Short details */}
      <div className="flex gap-4 flex-col md:flex-row text-sm" aria-describedby="modal-heading">
        <div className="flex gap-2 items-center">
          <User />
          <span>
            {invoice.customerName}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Calendar />
          <span>{formattedDate}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Loader />
          <Badge variant={'default'} className={statusClass[invoice.status]}>
            {invoice.status === INVOICE_STATUS.PAID && "Pagada"}
            {invoice.status === INVOICE_STATUS.CANCELED && "Cancelada"}
            {invoice.status === INVOICE_STATUS.PENDING && "Por pagar"}
          </Badge>
        </div>
      </div>

      {/* Table items */}
      <div className='bg-gray-950 rounded-md p-4'>
        <ShadTable.Table>
          <ShadTable.TableCaption>Lista de productos facturados</ShadTable.TableCaption>
          <ShadTable.TableHeader>
            <ShadTable.TableRow className="hover:bg-gray-900/20">
              <ShadTable.TableHead>Producto</ShadTable.TableHead>
              <ShadTable.TableHead>Precio</ShadTable.TableHead>
              <ShadTable.TableHead>Cantidad</ShadTable.TableHead>
              <ShadTable.TableHead className="text-right">Total</ShadTable.TableHead>
            </ShadTable.TableRow>
          </ShadTable.TableHeader>
          <ShadTable.TableBody>
            {invoice.items && invoice.items.map((item) => (
              <ShadTable.TableRow key={item.id} className="hover:bg-gray-800/20">
                <ShadTable.TableCell>{item.sale.product.name}</ShadTable.TableCell>
                <ShadTable.TableCell>{item.sale.product.price}</ShadTable.TableCell>
                <ShadTable.TableCell>{item.sale.productQuantity}</ShadTable.TableCell>
                <ShadTable.TableCell className="text-right">
                  ${Number(item.sale.product.price) * item.sale.productQuantity}
                </ShadTable.TableCell>
              </ShadTable.TableRow>
            ))}
          </ShadTable.TableBody>
          <ShadTable.TableFooter className="bg-gray-900">
            <ShadTable.TableRow className="hover:bg-gray-800/20">
              <ShadTable.TableCell colSpan={3}>Total</ShadTable.TableCell>
              <ShadTable.TableCell className="text-right">${invoice.total}</ShadTable.TableCell>
            </ShadTable.TableRow>
          </ShadTable.TableFooter>
        </ShadTable.Table>
      </div>
    </div>
  )
}
