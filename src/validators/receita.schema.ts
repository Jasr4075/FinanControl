import { z } from 'zod'

export const receitaCreateSchema = z.object({
  userId: z.string()
    .min(1, { message: 'Usuário é obrigatório' }),

  accountId: z.string()
    .min(1, { message: 'Conta é obrigatória' }),

  categoryId: z.string()
    .min(1, { message: 'Categoria é obrigatória' }),

  description: z.string()
    .min(1, { message: 'Descrição é obrigatória' })
    .max(255, { message: 'Descrição muito longa' }),

  quantidade: z.coerce.number({
    required_error: 'Quantidade é obrigatória',
    invalid_type_error: 'Quantidade inválida',
  })
    .min(0.01, { message: 'Quantidade deve ser maior que zero' }),

  data: z.coerce.date({
    required_error: 'Data é obrigatória',
    invalid_type_error: 'Data inválida',
  }),

  nota: z.string().optional(),
})

export type ReceitaCreateDTO = z.infer<typeof receitaCreateSchema>


export const receitaUpdateSchema = z.object({
  userId: z.string().optional(),
  accountId: z.string().optional(),
  categoryId: z.string().optional(),
  description: z.string().max(255).optional(),
  quantidade: z.coerce.number().min(0.01, { message: 'Quantidade deve ser maior que zero' }).optional(),
  data: z.coerce.date().optional(),
  nota: z.string().nullable().optional(),
})

export type ReceitaUpdateDTO = z.infer<typeof receitaUpdateSchema>
