import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string({
      message: 'El nombre debe ser letras',
    })
    .min(2, 'El nombre debe tener al menos 2 letras')
    .max(50, 'El nombre no puede tener más de 50 letras'),
  quantity: z.string().refine(
    (val) => {
      const num = Number(val);
      return num >= 0;
    },
    {
      message: 'La cantidad no puede ser negativa',
    },
  ),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  category: z.string().nullable(),
});

export const formSchemaDefaultValues: z.infer<typeof formSchema> = {
  category: null,
  name: '',
  price: 0,
  quantity: '',
};
