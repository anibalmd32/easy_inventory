'use client';
import { useEffect, useState } from 'react';
import { Category } from '@/definitions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 letras'),
  color: z.string(),
});

export function useCategoryForm(defaultValues?: Category) {
  const [openForm, setOpenForm] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const toggleForm = () => {
    console.log('toggleForm', openForm);
    setOpenForm(!openForm);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  useEffect(() => {
    if (defaultValues) {
      form.setValue('name', defaultValues.name);
      form.setValue('color', defaultValues.color);
    }
  }, [form, defaultValues]);

  return {
    form,
    onSubmit,
    toggleForm,
    openForm,
  };
}
