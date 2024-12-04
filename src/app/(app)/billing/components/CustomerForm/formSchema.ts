import { z } from 'zod';

export const formSchema = z.object({
  id: z.number().default(0),
  dni: z
    .string()
    .min(7, {
      message: 'Cédula muy corto',
    })
    .max(8, {
      message: 'Cédula muy largo',
    })
    .regex(/^\d+$/, 'Formato de cédula inválido')
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
  phone: z
    .string()
    .regex(/^(0412|0414|0424|0416|0426)\d{7}$/, {
      message: 'Formato de tlf invalido',
    })
    .min(11, {
      message: 'Numero de tlf muy corto',
    })
    .max(11, {
      message: 'Numero de tlf muy largo',
    }),
});
