'use client';

import * as ShadCard from '@/components/ui/card';
import * as ShadForm from '@/components/ui/form';
import * as React from 'react';
import * as ShadSheet from '@/components/ui/sheet';
import * as ShadCommand from '@/components/ui/command';
import * as ShadPopover from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomerForm } from './useCustomerForm';
import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CustomerForm() {
  const [openPrefixSelect, setOpenPrefixSelect] = useState(false);
  const [prefixValue, setPrefixValue] = useState('V');
  const {
    form,
    handleVerifyCustomer,
    isVerified,
    enableVerification,
    reVerifyCustomer,
  } = useCustomerForm();
  const { errors } = form.formState;

  const dniPrefixes = ['V', 'E', 'J', 'F', 'C', 'S'];

  return (
    <ShadCard.Card className="bg-gray-950 p-4 text-gray-200 w-full">
      <ShadCard.CardHeader>
        <ShadCard.CardTitle>Datos del cliente</ShadCard.CardTitle>
        <ShadCard.CardDescription>
          Rellene los datos del cliente para completar la facturación
        </ShadCard.CardDescription>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>
        <ShadForm.Form {...form}>
          <form className="space-y-2">
            <p>Identificación</p>
            <div className="flex gap-2 justify-center items-center">
              <ShadForm.FormField
                control={form.control}
                name="dni_prefix"
                render={({ field }) => (
                  <ShadForm.FormItem>
                    <ShadForm.FormControl>
                      <ShadPopover.Popover
                        open={openPrefixSelect}
                        onOpenChange={setOpenPrefixSelect}
                      >
                        <ShadPopover.PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPrefixSelect}
                            className="justify-between w-full bg-gray-900 text-gray-200"
                          >
                            {prefixValue
                              ? dniPrefixes.find(
                                  (prefix) => String(prefix) === prefixValue,
                                )
                              : 'Seleccione un prefijo...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </ShadPopover.PopoverTrigger>
                        <ShadPopover.PopoverContent className="w-full p-0 bg-gray-900 text-gray-200">
                          <ShadCommand.Command className="bg-gray-900 text-gray-200">
                            <ShadCommand.CommandInput
                              placeholder="Buscar el prefijo de identificación..."
                              className="bg-gray-900 text-gray-200"
                            />
                            <ShadCommand.CommandList className="bg-gray-900 text-gray-200">
                              <ShadCommand.CommandEmpty>
                                Prefijo no encontrada.
                              </ShadCommand.CommandEmpty>
                              <ShadCommand.CommandGroup className="max-h-40 overflow-y-auto">
                                {dniPrefixes.map((prefix) => (
                                  <ShadCommand.CommandItem
                                    className="bg-gray-900 text-gray-200 cursor-pointer"
                                    key={prefix}
                                    value={String(prefix)}
                                    onSelect={(currentValue) => {
                                      setPrefixValue(
                                        currentValue === prefixValue
                                          ? ''
                                          : currentValue,
                                      );
                                      setOpenPrefixSelect(false);
                                      field.onChange(
                                        currentValue === prefixValue
                                          ? null
                                          : currentValue,
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        prefixValue === String(prefix)
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {prefix}
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
              <ShadForm.FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <ShadForm.FormItem>
                    <ShadForm.FormControl>
                      <div className="flex justify-between items-center gap-2">
                        <Input
                          {...field}
                          className="bg-gray-900 text-gray-200"
                          onBlur={() => form.trigger('dni')}
                        />
                        <Button
                          disabled={!enableVerification}
                          type="button"
                          className={`bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200 ${
                            !reVerifyCustomer
                              ? 'text-green-300 ring-1 ring-green-300'
                              : 'text-red-400 ring-1 ring-red-400'
                          }`}
                          onClick={async () =>
                            await handleVerifyCustomer(field.value)
                          }
                        >
                          {reVerifyCustomer ? 'Verificar' : 'Verificando'}
                        </Button>
                      </div>
                    </ShadForm.FormControl>
                    <ShadForm.FormMessage>
                      {errors.dni?.message}
                    </ShadForm.FormMessage>
                  </ShadForm.FormItem>
                )}
              />
            </div>

            <ShadForm.FormField
              control={form.control}
              name="name"
              disabled={!isVerified}
              render={({ field }) => (
                <ShadForm.FormItem>
                  <ShadForm.FormLabel>Nombre</ShadForm.FormLabel>
                  <ShadForm.FormControl>
                    <Input
                      {...field}
                      className="bg-gray-900 text-gray-200"
                      onBlur={() => form.trigger('name')}
                    />
                  </ShadForm.FormControl>
                  <ShadForm.FormMessage>
                    {errors.name?.message}
                  </ShadForm.FormMessage>
                </ShadForm.FormItem>
              )}
            />
            <ShadForm.FormField
              control={form.control}
              name="phone"
              disabled={!isVerified}
              render={({ field }) => (
                <ShadForm.FormItem>
                  <ShadForm.FormLabel>Teléfono</ShadForm.FormLabel>
                  <ShadForm.FormControl>
                    <Input
                      {...field}
                      className="bg-gray-900 text-gray-200"
                      onBlur={() => form.trigger('phone')}
                    />
                  </ShadForm.FormControl>
                  <ShadForm.FormMessage>
                    {errors.phone?.message}
                  </ShadForm.FormMessage>
                </ShadForm.FormItem>
              )}
            />
          </form>
        </ShadForm.Form>
      </ShadCard.CardContent>
    </ShadCard.Card>
  );
}
