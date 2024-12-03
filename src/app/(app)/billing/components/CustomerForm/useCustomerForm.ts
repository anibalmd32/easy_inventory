'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useBilling } from '../../hooks/useBilling';
import { getCustomerByDni } from '@/core/frameworks/server-actions/customer.actions';
import { useToast } from '@/components/hooks/use-toast';

const formSchema = z.object({
  id: z.number().default(0),
  dni: z
    .string()
    .regex(/^\d+$/, 'La cédula debe contener solo números')
    .refine((val) => Number(val) > 1000000, {
      message: 'Formato de cédula inválido',
    }),
  name: z
    .string({
      message: 'Nombre invalido',
    })
    .min(3, {
      message: 'Nombre muy corto',
    })
    .max(50, {
      message: 'Nombre muy largo',
    })
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/, {
      message: 'El nombre solo puede contener letras',
    }),
  phone: z.string().regex(/^(0412|0414|0424|0416|0426)\d{7}$/, {
    message: 'Formato de tlf invalido',
  }),
});

export function useCustomerForm() {
  const { setCustomer, customer } = useBilling();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      dni: '',
      name: '',
      phone: '',
    },
    mode: 'onChange',
  });

  form.watch((values) => {
    setCustomer({
      id: values.id ?? 0,
      dni: values.dni ?? '',
      name: values.name ?? '',
      phone: values.phone ?? '',
    });
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleVerifyCustomer = async (dni: string) => {
    try {
      const verifiedCustomer = await getCustomerByDni(dni);
      if (verifiedCustomer) {
        form.setValue('id', verifiedCustomer.id);
        form.setValue('dni', verifiedCustomer.dni);
        form.setValue('name', verifiedCustomer.name);
        form.setValue('phone', verifiedCustomer.phone);
      } else {
        throw new Error('El cliente no esta registrado');
      }
    } catch (error: any) {
      form.setValue('name', '');
      form.setValue('phone', '');
      toast({
        title: 'Error',
        description: error.message,
        duration: 3000,
        variant: 'destructive',
      });
    }
  };

  return {
    form,
    onSubmit,
    handleVerifyCustomer,
  };
}
