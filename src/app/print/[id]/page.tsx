import { Invoice, Customer } from '@/definitions';
import { getInvoiceById } from '@/core/frameworks/server-actions/invoice.actions';
import { formatDate } from '@/lib/utils';

interface InvoiceCustomer extends Invoice {
  customer: Customer;
}

export default async function InvoiceTemplate({ params }: { params: { id: string } }) {
  const invoice = await getInvoiceById(Number(params.id));
  const invoiceCustomer: InvoiceCustomer = invoice as InvoiceCustomer;
  const formattedDate = formatDate(new Date(invoice.generatedAt));

  return (
    <div className="bg-white min-h-screen p-12 flex flex-col gap-20">
      <div className='flex justify-between'>
        <div>
          <p className='font-bold text-2xl'>Inventario Fácil</p>
          <p><span className='font-semibold'>Dirección:</span> Calle 1</p>
          <p><span className='font-semibold'>Tlf:</span> 0414 357 17 45</p>
        </div>

        <div>
          <p className='font-bold text-5xl'>Factura</p>
        </div>
      </div>

      <div className='flex justify-between'>
        <div>
          <p className='text-xl font-bold'>Cliente</p>
          <div className='border-t border-black mt-2'>
            <p><span className='font-semibold'>Nombre:</span> {invoiceCustomer.customer.name}</p>
            <p><span className='font-semibold'>Cédula:</span> {invoiceCustomer.customer.dni}</p>
            <p><span className='font-semibold'>Tlf:</span> {invoiceCustomer.customer.phone}</p>
          </div>
        </div>

        <div>
          <p className='text-xl font-bold'>Resumen</p>
          <div className='border-t border-black mt-2'>
            <p><span className='font-semibold'>Factura numero:</span> {invoice.id}</p>
            <p><span className='font-semibold'>Fecha:</span> {formattedDate}</p>
            <p><span className='font-semibold'>Total:</span> ${invoice.total}</p>
          </div>
        </div>
      </div>

      <div className='text-center'>
        <p className='text-xl font-bold'>Detalles de la compra</p>

        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Producto</th>
              <th className="border border-gray-300 px-4 py-2">Precio</th>
              <th className="border border-gray-300 px-4 py-2">Cantidad</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map(item => {
              return (
                <tr key={item.saleId} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{item.sale.product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">${item.sale.product.price}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.sale.productQuantity}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${Number(item.sale.product.price) * item.sale.productQuantity}
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <td className="border-t-2 border-gray-300 px-4 py-2 text-left font-semibold" colSpan={3}>
                Total
              </td>
              <td className="border-t-2 border-gray-300 px-4 py-2 font-semibold">
                ${invoice.total}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}