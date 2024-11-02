'use client';

import * as React from 'react';
import * as ShadSheet from '@/components/ui/sheet';
import * as ShadForm from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettings } from '../../hooks/useSettings';
import { useMinimunStockForm } from './useMinimunStockForm';

export function MinimunStockForm() {
  const { minStockForm, setMinStockForm } = useSettings();
  const { form, onSubmit } = useMinimunStockForm();

  return (
    <ShadSheet.Sheet
      open={minStockForm}
      onOpenChange={() => {
        setMinStockForm(!minStockForm);
        form.reset();
      }}
    >
      <ShadSheet.SheetContent className="bg-gray-950 text-gray-200">
        <ShadSheet.SheetHeader>
          <ShadSheet.SheetTitle className="text-gray-200">
            Editar Minimo de inventario
          </ShadSheet.SheetTitle>
          <ShadSheet.SheetDescription className="text-gray-200">
            Edita el stock minimo del inventario
          </ShadSheet.SheetDescription>
        </ShadSheet.SheetHeader>
        <div className="mt-6">
          <ShadForm.Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ShadForm.FormField
                control={form.control}
                name="minimunStock"
                render={({ field }) => (
                  <ShadForm.FormItem>
                    <ShadForm.FormLabel>
                      Minimo de inventario
                    </ShadForm.FormLabel>
                    <ShadForm.FormControl>
                      <Input className="bg-gray-900 text-gray-200" {...field} />
                    </ShadForm.FormControl>
                    <ShadForm.FormMessage />
                  </ShadForm.FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-gray-200 hover:text-gray-200 transition-all duration-300 w-full"
              >
                Guardar
              </Button>
            </form>
          </ShadForm.Form>
        </div>
      </ShadSheet.SheetContent>
    </ShadSheet.Sheet>
  );
}
