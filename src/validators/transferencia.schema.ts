import { z } from 'zod'

export const transferenciaCreateSchema = z.object({
  fromAccountId: z.string()
    .min(1, { message: 'Conta de origem é obrigatória' }),

  toAccountId: z.string()
    .min(1, { message: 'Conta de destino é obrigatória' }),

  amount: z.coerce.number({
    required_error: 'Valor é obrigatório',
    invalid_type_error: 'Valor inválido',
  }).min(0.01, { message: 'O valor deve ser maior que zero' }),

  date: z.coerce.date().optional(),

  description: z.string()
    .max(255, { message: 'Descrição muito longa' })
    .optional(),
})

export type TransferenciaCreateDTO = z.infer<typeof transferenciaCreateSchema>


export const transferenciaUpdateSchema = z.object({
  fromAccountId: z.string().optional(),
  toAccountId: z.string().optional(),
  amount: z.coerce.number().min(0.01).optional(),
  date: z.coerce.date().optional(),
  description: z.string().max(255).optional(),
})

export type TransferenciaUpdateDTO = z.infer<typeof transferenciaUpdateSchema>
