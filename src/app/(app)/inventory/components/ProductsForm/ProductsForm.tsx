'use client';
import * as React from 'react';
import * as ShadSheet from '@/components/ui/sheet';
import * as ShadForm from '@/components/ui/form';
import * as ShadCommand from '@/components/ui/command';
import * as ShadPopover from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInventory } from '../../hooks/useInventory';
import { useProductForm } from './useProductForm';

export function ProductsForm() {
  const { form, value, setValue, categories, onSubmit, open, setOpen } =
    useProductForm();
  const { openForm, setOpenForm } = useInventory();

  return (
    <ShadSheet.Sheet
      open={openForm}
      onOpenChange={() => {
        setOpenForm(!openForm);
        form.reset();
        setValue('');
      }}
    >
      <ShadSheet.SheetTrigger asChild>
        <Button
          onClick={() => setOpenForm(true)}
          className="bg-gray-950 hover:bg-gray-800 text-gray-200 hover:text-gray-200 transition-all duration-300"
        >
          Agregar producto
        </Button>
      </ShadSheet.SheetTrigger>
      <ShadSheet.SheetContent className="bg-gray-950 text-gray-200">
        <ShadSheet.SheetHeader>
          <ShadSheet.SheetTitle className="text-gray-200">
            Agregar Producto
          </ShadSheet.SheetTitle>
          <ShadSheet.SheetDescription className="text-gray-200">
            Agrega un nuevo producto al inventario.
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
                name="price"
                render={({ field }) => (
                  <ShadForm.FormItem>
                    <ShadForm.FormLabel>Precio</ShadForm.FormLabel>
                    <ShadForm.FormControl>
                      <Input
                        type="number"
                        className="bg-gray-900 text-gray-200"
                        {...field}
                      />
                    </ShadForm.FormControl>
                    <ShadForm.FormMessage />
                  </ShadForm.FormItem>
                )}
              />

              <ShadForm.FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <ShadForm.FormItem>
                    <ShadForm.FormLabel>Cantidad</ShadForm.FormLabel>
                    <ShadForm.FormControl>
                      <Input
                        type="number"
                        className="bg-gray-900 text-gray-200"
                        {...field}
                      />
                    </ShadForm.FormControl>
                    <ShadForm.FormMessage />
                  </ShadForm.FormItem>
                )}
              />

              <ShadForm.FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <ShadForm.FormItem>
                    <ShadForm.FormLabel>Categoría</ShadForm.FormLabel>
                    <ShadForm.FormControl>
                      <ShadPopover.Popover open={open} onOpenChange={setOpen}>
                        <ShadPopover.PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-between w-full bg-gray-900 text-gray-200"
                          >
                            {value
                              ? categories.find(
                                  (category) => String(category.value) === value
                                )?.label
                              : 'Seleccione una categoría...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </ShadPopover.PopoverTrigger>
                        <ShadPopover.PopoverContent className="w-full p-0 bg-gray-900 text-gray-200">
                          <ShadCommand.Command className="bg-gray-900 text-gray-200">
                            <ShadCommand.CommandInput
                              placeholder="Buscar categoría..."
                              className="bg-gray-900 text-gray-200"
                            />
                            <ShadCommand.CommandList className="bg-gray-900 text-gray-200">
                              <ShadCommand.CommandEmpty>
                                Categoría no encontrada.
                              </ShadCommand.CommandEmpty>
                              <ShadCommand.CommandGroup className="max-h-40 overflow-y-auto">
                                {categories.map((category) => (
                                  <ShadCommand.CommandItem
                                    className="bg-gray-900 text-gray-200 cursor-pointer"
                                    key={category.value}
                                    value={String(category.value)}
                                    onSelect={(currentValue) => {
                                      setValue(
                                        currentValue === value
                                          ? ''
                                          : currentValue
                                      );
                                      setOpen(false);
                                      field.onChange(
                                        currentValue === value
                                          ? null
                                          : currentValue
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        value === String(category.value)
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {category.label}
                                  </ShadCommand.CommandItem>
                                ))}
                              </ShadCommand.CommandGroup>
                            </ShadCommand.CommandList>
                          </ShadCommand.Command>
                        </ShadPopover.PopoverContent>
                      </ShadPopover.Popover>
                    </ShadForm.FormControl>
                    <ShadForm.FormMessage />
                  </ShadForm.FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-gray-200 hover:text-gray-200 transition-all duration-300 w-full"
              >
                Agregar
              </Button>
            </form>
          </ShadForm.Form>
        </div>
      </ShadSheet.SheetContent>
    </ShadSheet.Sheet>
  );
}
