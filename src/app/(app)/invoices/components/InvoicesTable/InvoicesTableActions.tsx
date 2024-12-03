import { Invoice, INVOICE_STATUS } from '@/definitions';
import { Calendar, User, Loader, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import * as ShadDialog from '@/components/ui/dialog';
import * as ShadTable from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useInvoices } from '../../hooks/useInvoices';
import { useRouter } from 'next/navigation';

interface InvoiceActionsProps {
  rowData: Invoice;
}

export const InvoiceDetails = ({ rowData }: InvoiceActionsProps) => {
  const date = new Date(rowData.generatedAt);
  const formattedDate = formatDate(date);

  const { invoiceEvents, billingEvents } = useInvoices();

  const router = useRouter();

  const status = rowData.status;
  const items = rowData.items;
  const total = rowData.total;
  const statusClass = {
    [INVOICE_STATUS.PAID]: 'bg-green-500',
    [INVOICE_STATUS.CANCELED]: 'bg-red-500',
    [INVOICE_STATUS.PENDING]: 'bg-yellow-500',
  };

  return (
    <ShadDialog.Dialog>
      <ShadDialog.DialogTrigger className="cursor-pointer hover:bg-gray-200 text-gray-200 hover:text-black transition-all duration-300 w-full p-1 pl-2 rounded-sm text-left mt-1 text-sm">
        Ver Detalles
      </ShadDialog.DialogTrigger>
      <ShadDialog.DialogContent
        aria-describedby="modal-heading"
        className="md:min-w-[800px] bg-gray-950 text-gray-200"
      >
        <ShadDialog.DialogHeader id="modal-heading">
          <ShadDialog.DialogTitle className="text-2xl font-bold">
            Factura #{rowData.id}
          </ShadDialog.DialogTitle>
        </ShadDialog.DialogHeader>

        {/* Short details */}
        <div
          className="flex gap-4 flex-col md:justify-between md:flex-row text-sm"
          aria-describedby="modal-heading"
        >
          <div className="flex gap-4 flex-col md:flex-row text-sm">
            <div className="flex gap-2 items-center">
              <User />
              <span>{rowData.customerName}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Calendar />
              <span>{formattedDate}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Loader />
              <Badge variant={'default'} className={statusClass[status]}>
                {status === INVOICE_STATUS.PAID && 'Pagada'}
                {status === INVOICE_STATUS.CANCELED && 'Cancelada'}
                {status === INVOICE_STATUS.PENDING && 'Por pagar'}
              </Badge>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {status !== INVOICE_STATUS.CANCELED && (
              <Button
                className="bg-transparent border border-red-400 hover:bg-red-400 hover:text-gray-200 text-gray-200 transition-all duration-300"
                onClick={async () => {
                  await billingEvents.onCancelInvoice(rowData.id);
                  window.location.reload();
                }}
              >
                Cancelar
              </Button>
            )}
            {status === INVOICE_STATUS.PENDING && (
              <Button
                className="bg-gray-900 hover:bg-gray-800 text-gray-200 transition-all duration-300"
                onClick={async () => {
                  await billingEvents.onPayInvoice(rowData.id);
                  window.location.reload();
                }}
              >
                Pagar
              </Button>
            )}
          </div>
        </div>

        {/* Table items */}
        <ShadTable.Table>
          <ShadTable.TableHeader>
            <ShadTable.TableRow className="hover:bg-gray-900/20">
              <ShadTable.TableHead>Producto</ShadTable.TableHead>
              <ShadTable.TableHead>Precio</ShadTable.TableHead>
              <ShadTable.TableHead>Cantidad</ShadTable.TableHead>
              <ShadTable.TableHead className="text-right">
                Total
              </ShadTable.TableHead>
            </ShadTable.TableRow>
          </ShadTable.TableHeader>
          <ShadTable.TableBody>
            {items &&
              items.map((item) => (
                <ShadTable.TableRow
                  key={item.id}
                  className="hover:bg-gray-800/20"
                >
                  <ShadTable.TableCell>
                    {item.sale.product.name}
                  </ShadTable.TableCell>
                  <ShadTable.TableCell>
                    ${item.sale.product.price}
                  </ShadTable.TableCell>
                  <ShadTable.TableCell>
                    {item.sale.productQuantity}
                  </ShadTable.TableCell>
                  <ShadTable.TableCell className="text-right">
                    $
                    {Number(item.sale.product.price) *
                      item.sale.productQuantity}
                  </ShadTable.TableCell>
                </ShadTable.TableRow>
              ))}
          </ShadTable.TableBody>
          <ShadTable.TableFooter className="bg-gray-900">
            <ShadTable.TableRow className="hover:bg-gray-800/20">
              <ShadTable.TableCell colSpan={3}>Total</ShadTable.TableCell>
              <ShadTable.TableCell className="text-right">
                ${total}
              </ShadTable.TableCell>
            </ShadTable.TableRow>
          </ShadTable.TableFooter>
        </ShadTable.Table>

        <div>
          <Button
            variant="outline"
            className="text-sm w-full flex gap-2 items-center bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={async () => {
              await invoiceEvents.onPrintInvoice(rowData.id);
            }}
          >
            <Printer />
            <span>Imprimir</span>
          </Button>
        </div>
      </ShadDialog.DialogContent>
    </ShadDialog.Dialog>
  );
};
