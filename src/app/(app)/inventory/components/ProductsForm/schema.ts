import { z } from "zod"

export const formSchema = z.object({
  name: z.string({
    description: 'El nombre de ser letras'
  }).min(2, 'El nombre debe tener al menos 2 letras').max(50, 'El nombre no puede tener mas de 50 letras'),
  quantity: z.number().min(1, 'El cantidad debe ser mayor a 1').max(1000, 'El cantidad no puede ser mayor a 1000'),
  price: z.number().min(1, 'El precio debe ser mayor a 1').max(1000, 'El precio no puede ser mayor a 1000'),
  category: z.string().min(2).max(50).nullable(),
})
