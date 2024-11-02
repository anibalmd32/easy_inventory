import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string({ message: 'El nombre de ser letras' })
    .min(2, 'El nombre debe tener al menos 2 letras')
    .max(20, 'El nombre no puede tener mas de 20 letras'),
  color: z.string(),
});

export const formSchemaDefaultValues: z.infer<typeof formSchema> = {
  name: '',
  color: '',
};
