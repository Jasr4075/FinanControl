import { z } from 'zod'

export const transacaoRecorrenteCreateSchema = z.object({
  userId: z.string()
    .min(1, { message: 'Usuário é obrigatório' }),

  type: z.enum(['Despesa', 'Receita'], {
    required_error: 'Tipo da transação é obrigatório',
    invalid_type_error: 'Tipo deve ser "Despesa" ou "Receita"',
  }),

  amount: z.coerce.number({
    required_error: 'Valor é obrigatório',
    invalid_type_error: 'Valor inválido',
  })
    .min(0.01, { message: 'O valor deve ser maior que zero' }),

  descricao: z.string()
    .min(1, { message: 'Descrição é obrigatória' })
    .max(255, { message: 'Descrição muito longa' }),

  frequencia: z.enum(['diario', 'semanal', 'mensal'], {
    required_error: 'Frequência é obrigatória',
    invalid_type_error: 'Frequência deve ser "diario", "semanal" ou "mensal"',
  }),

  dataInicio: z.coerce.date({
    required_error: 'Data de início é obrigatória',
    invalid_type_error: 'Data de início inválida',
  }),

  dataFinal: z.coerce.date().nullable().optional(),

  categoryId: z.string()
    .min(1, { message: 'Categoria é obrigatória' }),

  active: z.boolean().optional(),
})

export type TransacaoRecorrenteCreateDTO = z.infer<typeof transacaoRecorrenteCreateSchema>


export const transacaoRecorrenteUpdateSchema = z.object({
  userId: z.string().optional(),
  type: z.enum(['Despesa', 'Receita']).optional(),
  amount: z.coerce.number().min(0.01).optional(),
  descricao: z.string().max(255).optional(),
  frequencia: z.enum(['diario', 'semanal', 'mensal']).optional(),
  dataInicio: z.coerce.date().optional(),
  dataFinal: z.coerce.date().nullable().optional(),
  categoryId: z.string().optional(),
  active: z.boolean().optional(),
})

export type TransacaoRecorrenteUpdateDTO = z.infer<typeof transacaoRecorrenteUpdateSchema>
