import { z } from 'zod'

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Mínimo 3 caracteres' })
    .max(30, { message: 'Máximo 30 caracteres' }),
  username: z
    .string()
    .min(3, { message: 'Mínimo 3 caracteres' })
    .max(30, { message: 'Máximo 30 caracteres' }),
  bio: z
    .string()
    .min(10, { message: 'Mínimo 10 caracteres' })
    .max(100, { message: 'Máximo 100 caracteres' }),
  image: z
    .string()
    .min(1, { message: 'La imagen es requerida' })
    .url({ message: 'URL inválida' })
})
