'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBilling } from '../../hooks/useBilling';
import {
  Plus,
  ShoppingCart,
  ShoppingBag,
  DollarSign,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDolarStore } from '@/store/dolarStore';

export function ProductDetails() {
  const { selectedProduct, selectProductOperations } = useBilling();
  const { price } = useDolarStore();

  return (
    <Card className="bg-gray-950 p-4 text-gray-200 w-full">
      {selectedProduct ? (
        <>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center justify-between">
              <span>{selectedProduct.name}</span>
              <span>
                <Badge
                  variant="default"
                  style={{ backgroundColor: selectedProduct.category?.color }}
                >
                  {selectedProduct.category
                    ? selectedProduct.category.name
                    : 'Sin categoría'}
                </Badge>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-start">
            <div className="flex gap-4 items-center">
              <p className="flex gap-2 items-center">
                <DollarSign className="h-4 w-4" />
                <span>{selectedProduct.price}</span>
                {price && <span>(Bs. {selectedProduct.price * price})</span>}
              </p>
              <p className="flex gap-2 items-center">
                <ShoppingCart className="h-4 w-4" />
                <span>{selectedProduct.amount}</span>
              </p>
              <p className="flex gap-2 items-center">
                <ShoppingBag className="h-4 w-4" />
                <span>
                  ${selectedProduct.amount * Number(selectedProduct.price)}
                  {price && (
                    <span>
                      (Bs.{' '}
                      {selectedProduct.amount *
                        Number(selectedProduct.price) *
                        price}
                      )
                    </span>
                  )}
                </span>
              </p>
            </div>
            <div className="flex gap-4 flex-wrap justify-center items-center">
              <Button
                onClick={() => selectProductOperations.onUnselectProduct()}
                className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
                size={'sm'}
              >
                Remover
              </Button>
              <Button
                onClick={() =>
                  selectProductOperations.onSelectedProductCounterDecrement()
                }
                className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
                size={'sm'}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                onClick={() =>
                  selectProductOperations.onSelectedProductCounterIncrement()
                }
                className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
                size={'sm'}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                onClick={selectProductOperations.onAddProductToCart}
                className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
                size={'sm'}
              >
                Agregar al carrito
              </Button>
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent>
          <p>No hay producto seleccionado</p>
        </CardContent>
      )}
    </Card>
  );
}
