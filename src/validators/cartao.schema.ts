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

  hasCashback: z.boolean().optional().default(false),

  cashbackPercent: z.number()
    .min(0, 'Percentual de cashback não pode ser negativo')
    .optional()
    .default(0),

  creditLimit: z.number()
    .min(0, 'Limite não pode ser negativo')
    .optional()
    .default(0),

  closingDay: z.coerce.number().min(1).max(28).optional(),
  dueDay: z.coerce.number().min(1).max(28).optional(),

  active: z.boolean().optional().default(true),
}).refine(
  (data) => {
    if (data.type === 'CREDITO' || data.type === 'MISTO') {
      return data.closingDay !== undefined && data.dueDay !== undefined
    }
    return true
  },
  {
    message: 'closingDay e dueDay são obrigatórios para cartões de crédito ou misto',
    path: ['closingDay'], // aparece o erro nesses campos
  }
)

export type CartaoCreateDTO = z.infer<typeof cartaoCreateSchema>
 