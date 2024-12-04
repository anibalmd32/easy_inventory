'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useBilling } from '../../hooks/useBilling';
import { getCustomerByDni } from '@/core/frameworks/server-actions/customer.actions';
import { useToast } from '@/components/hooks/use-toast';
import { formSchema } from './formSchema';
import { useState, useEffect } from 'react';

export function useCustomerForm() {
  const [isVerified, setIsVerified] = useState(false);
  const [enableVerification, setEnableVerification] = useState(false);
  const { setCustomer, setReVerifyCustomer, reVerifyCustomer } = useBilling();
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

  const dni = form.watch('dni');

  useEffect(() => {
    if (dni) {
      if (dni.length >= 7 && dni.length <= 8) {
        setEnableVerification(true);
        setReVerifyCustomer(true);
      } else {
        setEnableVerification(false);
      }
    }
  }, [dni, setReVerifyCustomer]);

  // Use useEffect to update the customer state
  useEffect(() => {
    const subscription = form.watch((values) => {
      setCustomer({
        id: values.id ?? 0,
        dni: values.dni ?? '',
        name: values.name ?? '',
        phone: values.phone ?? '',
      });
    });
    return () => subscription.unsubscribe();
  }, [form, setCustomer]);

  const handleVerifyCustomer = async (dni: string) => {
    try {
      const verifiedCustomer = await getCustomerByDni(dni);
      if (verifiedCustomer) {
        form.setValue('id', verifiedCustomer.id);
        form.setValue('dni', verifiedCustomer.dni);
        form.setValue('name', verifiedCustomer.name);
        form.setValue('phone', verifiedCustomer.phone);
      } else {
        throw new Error('El cliente no está registrado');
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
      setIsVerified(true);
    } finally {
      setReVerifyCustomer(false);
      setEnableVerification(false);
    }
  };

  return {
    form,
    handleVerifyCustomer,
    isVerified,
    enableVerification,
    reVerifyCustomer,
  };
}
