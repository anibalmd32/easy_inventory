'use client';

import * as ShadCard from '@/components/ui/card';
import * as ShadForm from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomerForm } from './useCustomerForm';

export function CustomerForm() {
  const { form, handleVerifyCustomer, isVerified } = useCustomerForm();
  const { errors } = form.formState;

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
            <ShadForm.FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <ShadForm.FormItem>
                  <ShadForm.FormLabel>Cédula</ShadForm.FormLabel>
                  <ShadForm.FormControl>
                    <div className="flex justify-between items-center gap-2">
                      <Input
                        {...field}
                        className="bg-gray-900 text-gray-200"
                        onBlur={() => form.trigger('dni')}
                      />
                      <Button
                        type="button"
                        className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
                        onClick={async () =>
                          await handleVerifyCustomer(field.value)
                        }
                      >
                        Verificar
                      </Button>
                    </div>
                  </ShadForm.FormControl>
                  <ShadForm.FormMessage>
                    {errors.dni?.message}
                  </ShadForm.FormMessage>
                </ShadForm.FormItem>
              )}
            />

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
