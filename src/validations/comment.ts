import { z } from 'zod'

export const CommentValidation = z.object({
  comment: z.string().min(3, { message: 'Mínimo 3 caracteres.' }),
  image: z.string(),
}).partial()
