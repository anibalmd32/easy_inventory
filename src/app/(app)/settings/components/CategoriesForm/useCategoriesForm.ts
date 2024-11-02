import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettings } from '../../hooks/useSettings';
import { formSchema } from './Schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export function useCategoriesForm() {
  const { defaultFormValues } = useSettings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.setValue('name', defaultFormValues.name);
    form.setValue('color', defaultFormValues.color);
  }, [defaultFormValues, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return { form, onSubmit };
}
