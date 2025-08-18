import { z } from 'zod'

export const cashbackCreateSchema = z.object({
  cartaoId: z.string()
    .min(1, { message: 'Cartão é obrigatório' }),

  quantidade: z.coerce.number({
    required_error: 'Quantidade é obrigatória',
    invalid_type_error: 'Quantidade inválida',
  })
    .min(0.01, { message: 'Quantidade deve ser maior que zero' }),

  description: z.string()
    .min(1, { message: 'Descrição é obrigatória' }),

  despesaId: z.string()
    .min(1, { message: 'Despesa é obrigatória' }),

  creditDate: z.coerce.date({
    required_error: 'Data de crédito é obrigatória',
    invalid_type_error: 'Data de crédito inválida',
  }),
})

export type CashbackCreateDTO = z.infer<typeof cashbackCreateSchema>


export const cashbackUpdateSchema = z.object({
  cartaoId: z.string().optional(),
  quantidade: z.coerce.number().min(0.01, { message: 'Quantidade deve ser maior que zero' }).optional(),
  description: z.string().min(1, { message: 'Descrição inválida' }).optional(),
  despesaId: z.string().optional(),
  creditDate: z.coerce.date().optional(),
})

export type CashbackUpdateDTO = z.infer<typeof cashbackUpdateSchema>
