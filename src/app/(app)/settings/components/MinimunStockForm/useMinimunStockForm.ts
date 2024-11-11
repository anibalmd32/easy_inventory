import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { formSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';

export function useMinimunStockForm() {
  const { settings } = useSettings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.setValue('minimunStock', settings.minimumStock);
  }, [form, settings.minimumStock]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return { form, onSubmit };
}
