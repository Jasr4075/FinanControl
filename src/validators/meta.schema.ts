import { z } from 'zod'

export const metaCreateSchema = z.object({
  usuarioId: z.string()
    .min(1, { message: 'Usuário é obrigatório' }),

  categoryId: z.string()
    .min(1, { message: 'Categoria é obrigatória' }),

  limitAmount: z.coerce.number({
    required_error: 'Limite é obrigatório',
    invalid_type_error: 'Limite inválido',
  })
    .min(0.01, { message: 'Limite deve ser maior que zero' }),

  month: z.coerce.number({
    required_error: 'Mês é obrigatório',
    invalid_type_error: 'Mês inválido',
  })
    .min(1, { message: 'Mês deve ser entre 1 e 12' })
    .max(12, { message: 'Mês deve ser entre 1 e 12' }),

  year: z.coerce.number({
    required_error: 'Ano é obrigatório',
    invalid_type_error: 'Ano inválido',
  })
    .min(1900, { message: 'Ano inválido' }),
})

export type MetaCreateDTO = z.infer<typeof metaCreateSchema>


export const metaUpdateSchema = z.object({
  usuarioId: z.string().optional(),
  categoryId: z.string().optional(),
  limitAmount: z.coerce.number().min(0.01, { message: 'Limite deve ser maior que zero' }).optional(),
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().min(1900, { message: 'Ano inválido' }).optional(),
})

export type MetaUpdateDTO = z.infer<typeof metaUpdateSchema>
