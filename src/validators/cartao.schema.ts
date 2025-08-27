import { z } from 'zod'

export const cartaoCreateSchema = z.object({
  userId: z.string()
    .min(1, { message: 'Usuário é obrigatório' }),

  contaId: z.string()
    .min(1, { message: 'Conta é obrigatória' }),

  nome: z.string()
    .min(1, { message: 'Nome é obrigatório' }),

  type: z.enum(['CREDITO', 'DEBITO', 'MISTO'], {
    required_error: 'Tipo de cartão é obrigatório',
    invalid_type_error: 'Tipo de cartão inválido',
  }),

  hasCashback: z.boolean()
    .optional()
    .default(false),

  cashbackPercent: z.number()
    .min(0, 'Percentual de cashback não pode ser negativo')
    .optional()
    .default(0),

  creditLimit: z.number()
    .min(0, 'Limite não pode ser negativo')
    .optional()
    .default(0),

  closingDay: z.coerce.number({
    required_error: 'Dia de fechamento é obrigatório',
    invalid_type_error: 'Dia de fechamento inválido',
  })
  .min(1, { message: 'Dia de fechamento inválido' })
  .max(28, { message: 'Dia de fechamento deve ser até 28' }),

  dueDay: z.coerce.number({
    required_error: 'Dia de vencimento é obrigatório',
    invalid_type_error: 'Dia de vencimento inválido',
  })
  .min(1, { message: 'Dia de vencimento inválido' })
  .max(28, { message: 'Dia de vencimento deve ser até 28' }),

  active: z.boolean()
    .optional()
    .default(true),
})

export type CartaoCreateDTO = z.infer<typeof cartaoCreateSchema>
