import { z } from 'zod'

export const contaCreateSchema = z.object({
  userId: z.string()
    .min(1, 'Usuário é obrigatório'),

  type: z.enum(['CORRENTE', 'POUPANCA', 'EFETIVO'], {
    errorMap: () => ({ message: 'Tipo de conta inválido' }),
  }),

  bancoNome: z.string()
    .min(1, 'Nome do banco é obrigatório')
    .transform(nome => nome.trim()),

  agencia: z.string()
    .min(1, 'Agência é obrigatória')
    .transform(agencia => agencia.trim()),

  conta: z.string()
    .min(1, 'Conta é obrigatória')
    .transform(conta => conta.trim()),

  saldo: z.number()
    .min(0, 'Saldo não pode ser negativo')
    .optional()
    .default(0),

  efetivo: z.boolean()
    .optional()
    .default(false),

  cdiPercent: z.number()
    .min(0, 'CDI Percentual não pode ser negativo')
    .optional()
    .default(0),
})

export type ContaCreateDTO = z.infer<typeof contaCreateSchema>


export const contaUpdateSchema = z.object({
  type: z.enum(['CORRENTE', 'POUPANCA', 'EFETIVO'], {
    errorMap: () => ({ message: 'Tipo de conta inválido' }),
  }).optional(),

  bancoNome: z.string()
    .min(1, 'Nome do banco não pode ser vazio')
    .transform(nome => nome.trim())
    .optional(),

  agencia: z.string()
    .min(1, 'Agência inválida')
    .transform(agencia => agencia.trim())
    .optional(),

  conta: z.string()
    .min(1, 'Conta inválida')
    .transform(conta => conta.trim())
    .optional(),

  saldo: z.number()
    .min(0, 'Saldo não pode ser negativo')
    .optional(),

  efetivo: z.boolean()
    .optional(),

  cdiPercent: z.number()
    .min(0, 'CDI Percentual não pode ser negativo')
    .optional(),
})

export type ContaUpdateDTO = z.infer<typeof contaUpdateSchema>
