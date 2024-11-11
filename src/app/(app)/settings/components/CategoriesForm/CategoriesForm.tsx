'use client';

import * as React from 'react';
import * as ShadSheet from '@/components/ui/sheet';
import * as ShadForm from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCategoriesForm } from './useCategoriesForm';
import { useSettings } from '../../hooks/useSettings';
import { ColorPicker } from '@/components/shared/ColorPicker';

export function CategoriesForm() {
  const { categoriesOpenForm, setCategoriesOpenForm } = useSettings();

  const { form, onSubmit } = useCategoriesForm();

  return (
    <ShadSheet.Sheet
      open={categoriesOpenForm}
      onOpenChange={() => {
        setCategoriesOpenForm(!categoriesOpenForm);
        form.reset();
      }}
    >
      <ShadSheet.SheetContent className="bg-gray-950 text-gray-200">
        <ShadSheet.SheetHeader>
          <ShadSheet.SheetTitle className="text-gray-200">
            Editar Categoria
          </ShadSheet.SheetTitle>
          <ShadSheet.SheetDescription className="text-gray-200">
            Edita la categoria seleccionada
          </ShadSheet.SheetDescription>
        </ShadSheet.SheetHeader>
        <div className="mt-6">
          <ShadForm.Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ShadForm.FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <ShadForm.FormItem>
                    <ShadForm.FormLabel>Nombre</ShadForm.FormLabel>
                    <ShadForm.FormControl>
                      <Input className="bg-gray-900 text-gray-200" {...field} />
                    </ShadForm.FormControl>
                    <ShadForm.FormMessage />
                  </ShadForm.FormItem>
                )}
              />

              <ShadForm.FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <ShadForm.FormItem>
                    <ShadForm.FormControl>
                      <div className="flex items-center gap-3">
                        <ColorPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <span>{field.value}</span>
                      </div>
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
