import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './Schema';
import { useSettings } from '../../hooks/useSettings';

export function useBusinessNameForm() {
  const { settings } = useSettings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.setValue('name', settings.businessName);
  }, [settings.businessName, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return { form, onSubmit };
}
