import { z } from 'zod';

export const formSchema = z.object({
  minimunStock: z.coerce.number().min(1).max(100),
});
