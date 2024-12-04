'use client';
import * as ShadCard from '@/components/ui/card';
import * as ShadTable from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useBilling } from '../../hooks/useBilling';
import { Minus, Plus, Trash } from 'lucide-react';

export function Cart() {
  const { selectProductOperations, cart, customer, reVerifyCustomer } =
    useBilling();
  const disabled =
    cart.items.length === 0 ||
    !customer.dni ||
    !customer.name ||
    !customer.phone ||
    reVerifyCustomer;

  return (
    <ShadCard.Card className="bg-gray-950 p-4 text-gray-200 w-full">
      <ShadCard.CardHeader>
        <div className="flex justify-between">
          <ShadCard.CardTitle>Resumen de compra</ShadCard.CardTitle>
          <Button
            className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
            disabled={disabled}
            onClick={async () =>
              await selectProductOperations.onGenerateInvoice()
            }
          >
            Generar factura
          </Button>
        </div>
        <ShadCard.CardDescription>
          Lista de los productos a facturar
        </ShadCard.CardDescription>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>
        <ShadTable.Table>
          <ShadTable.TableHeader>
            <ShadTable.TableRow className="hover:bg-gray-900/20">
              <ShadTable.TableHead>Producto</ShadTable.TableHead>
              <ShadTable.TableHead>Precio</ShadTable.TableHead>
              <ShadTable.TableHead>Cantidad</ShadTable.TableHead>
              <ShadTable.TableHead className="text-right">
                Total
              </ShadTable.TableHead>
              <ShadTable.TableHead></ShadTable.TableHead>
            </ShadTable.TableRow>
          </ShadTable.TableHeader>
          <ShadTable.TableBody>
            {cart.items &&
              cart.items.map((item, i) => (
                <ShadTable.TableRow key={i} className="hover:bg-gray-800/20">
                  <ShadTable.TableCell>{item.name}</ShadTable.TableCell>
                  <ShadTable.TableCell>${item.price}</ShadTable.TableCell>
                  <ShadTable.TableCell>{item.amount}</ShadTable.TableCell>
                  <ShadTable.TableCell className="text-right">
                    ${item.amount * Number(item.price)}
                  </ShadTable.TableCell>
                  <ShadTable.TableCell className="text-right flex gap-2">
                    <Button
                      size={'icon'}
                      className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
                      onClick={() =>
                        selectProductOperations.onSelectedProductCounterDecrement(
                          item.id,
                        )
                      }
                    >
                      <Minus />
                    </Button>
                    <Button
                      size={'icon'}
                      className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
                      onClick={() =>
                        selectProductOperations.onSelectedProductCounterIncrement(
                          item.id,
                        )
                      }
                    >
                      <Plus />
                    </Button>
                    <Button
                      size={'icon'}
                      className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
                      onClick={() =>
                        selectProductOperations.onUnselectProduct(item.id)
                      }
                    >
                      <Trash />
                    </Button>
                  </ShadTable.TableCell>
                </ShadTable.TableRow>
              ))}
          </ShadTable.TableBody>
          <ShadTable.TableFooter className="bg-gray-900">
            <ShadTable.TableRow className="hover:bg-gray-800/20">
              <ShadTable.TableCell colSpan={4}>Total</ShadTable.TableCell>
              <ShadTable.TableCell className="text-right">
                ${cart.total}
              </ShadTable.TableCell>
            </ShadTable.TableRow>
          </ShadTable.TableFooter>
        </ShadTable.Table>
      </ShadCard.CardContent>
    </ShadCard.Card>
  );
}
