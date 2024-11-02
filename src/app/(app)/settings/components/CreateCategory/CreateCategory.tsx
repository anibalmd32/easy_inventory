'use client';

import * as ShadForm from '@/components/ui/form';
import * as ShadCard from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomerForm } from '@/app/(app)/billing/components/CustomerForm/useCustomerForm';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { useSettings } from '../../hooks/useSettings';

const CreateCategory = () => {
  const { form, onSubmit } = useCustomerForm();
  const { eventHandler, selectedColor } = useSettings();

  const handleCreateCategory = () =>
    console.log('creating catogory', selectedColor);

  return (
    <ShadCard.Card className="bg-gray-950 text-gray-200">
      <ShadCard.CardHeader>
        <ShadCard.CardTitle>Crear Categoria</ShadCard.CardTitle>
        <ShadCard.CardDescription>
          Ingresa el nombre de la categoria
        </ShadCard.CardDescription>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>
        <ShadForm.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <ShadForm.FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <ShadForm.FormItem>
                  <ShadForm.FormControl>
                    <div className="flex justify-between items-center gap-2">
                      <Input
                        {...field}
                        className="bg-gray-900 text-gray-200 flex-1"
                      />
                      <ColorPicker
                        value={selectedColor}
                        onChange={eventHandler.onColorChange}
                      />
                    </div>
                  </ShadForm.FormControl>
                  <ShadForm.FormMessage />
                </ShadForm.FormItem>
              )}
            />
            <Button
              type="button"
              className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200 min-w-full"
              onClick={() => handleCreateCategory()}
            >
              Crear
            </Button>
          </form>
        </ShadForm.Form>
      </ShadCard.CardContent>
    </ShadCard.Card>
  );
};
export default CreateCategory;
