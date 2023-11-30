import { z } from "zod";

export const ThreadValidation = z.object({
  thread: z.string().min(3, { message: 'Mínimo 3 caracteres.' }),
  image: z.string(),
  accountId: z.string()
}).partial()
