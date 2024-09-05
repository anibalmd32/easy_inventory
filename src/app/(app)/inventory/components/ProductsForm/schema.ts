import { z } from "zod"

export const formSchema = z.object({
  name: z.string({
    message: 'El nombre de ser letras'
  }).min(2, 'El nombre debe tener al menos 2 letras').max(50, 'El nombre no puede tener mas de 50 letras'),
  quantity: z.string(),
  price: z.string(),
  category: z.string().nullable(),
})

export const formSchemaDefaultValues: z.infer<typeof formSchema> = {
  category: null,
  name: '',
  price: '',
  quantity: ''
}
