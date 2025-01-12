'use client';
import { PageTitle } from '@/components/shared/PageTitle';
import { FormField, Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DatePickerWithRange } from '@/components/shared/DatePickerRange/DatePickerRange';
import { fetcher } from '@/lib/fetcher';
import { useEffect, useTransition } from 'react';
import { SaleReport } from '@/definitions';
import { useToast } from '@/components/hooks/use-toast';

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

  const [isLoadingReports, startReportsTransition] = useTransition();
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { dateRange } = data;

    if (!dateRange.from) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar una fecha',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    const start = new Date(dateRange.from);
    const end = dateRange.to ? new Date(dateRange.to) : start;

    startReportsTransition(async () => {
      const { data } = await fetcher.post<SaleReport>('/reports', {
        start,
        end,
      });

      console.log(data);
    });
  };

  useEffect(() => {
    if (isLoadingReports) {
      toast({
        title: 'Cargando',
        description: 'Generando reporte de ventas',
      });
    }
  }, [isLoadingReports, toast]);

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
