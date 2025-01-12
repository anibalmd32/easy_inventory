'use client';
import { PageTitle } from '@/components/shared/PageTitle';
import { FormField, Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DatePickerWithRange } from '@/components/shared/DatePickerRange/DatePickerRange';

const formSchema = z.object({
  dateRange: z.any(),
});

export const Reports = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: null,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const { dateRange } = data;

    console.log(dateRange);
  };
  return (
    <div>
      <PageTitle>Reporte de ventas</PageTitle>

      <div>
        <form
          className="flex gap-4 flex-col md:flex-row"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <DatePickerWithRange
                  className="w-full"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Button
              type="submit"
              className="bg-gray-900 flex-1 hover:bg-gray-800 text-gray-200 hover:text-gray-200 transition-all duration-300 w-full"
            >
              Generar
            </Button>
          </Form>
        </form>
      </div>
    </div>
  );
};
