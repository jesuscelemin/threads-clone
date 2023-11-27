import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(3, { message: 'El nombre es muy corto' }),
  email: z.string().email({ message: 'El emainl no es válido' }),
  password: z.string().min(6, { message: 'La contraseña es demasiado corta' })
})

export const LoginSchema = z.object({
  email: z.string().email({ message: 'El email no es válido' }),
  password: z.string().min(6, { message: 'La contraseña es demasiado corta' })
})
