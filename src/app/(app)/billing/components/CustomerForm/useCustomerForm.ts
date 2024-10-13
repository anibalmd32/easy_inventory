'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useBilling } from '../../hooks/useBilling';
import { getCustomerByDni } from '@/core/frameworks/server-actions/customer.actions';
import { useToast } from '@/components/hooks/use-toast';


const formSchema = z.object({
  id: z.number().default(0),
  dni: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
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
