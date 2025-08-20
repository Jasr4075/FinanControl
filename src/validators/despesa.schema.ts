import { z } from 'zod'

export const despesaCreateSchema = z.object({
    userId: z.string()
        .min(1, { message: 'Usuário é obrigatório' }),

    contaId: z.string()
        .optional(),

    cartaoId: z.string()
        .optional(),

    categoryId: z.string()
        .min(1, { message: 'Categoria é obrigatória' }),

    descricao: z.string()
        .min(1, { message: 'Descrição é obrigatória' }),

    valor: z.coerce.number({
        required_error: 'Valor é obrigatório',
        invalid_type_error: 'Valor inválido',
    })
        .min(0.01, { message: 'Valor deve ser maior que zero' }),

    metodoPagamento: z.enum(['PIX', 'CREDITO', 'DEBITO', 'DINHERO'], {
        required_error: 'Método de pagamento é obrigatório',
        invalid_type_error: 'Método de pagamento inválido',
    }),

    data: z.coerce.date({
        required_error: 'Data da despesa é obrigatória',
        invalid_type_error: 'Data inválida',
    }),

    parcelado: z.boolean()
        .optional()
        .default(false),

    numeroParcelas: z.coerce.number()
        .min(1, { message: 'Número de parcelas deve ser pelo menos 1' })
        .optional()
        .default(1),

    juros: z.coerce.number()
        .min(0, { message: 'Juros não pode ser negativo' })
        .optional()
        .default(0),

    observacoes: z.string()
        .optional()
        .transform(obs => obs?.trim() || undefined),
})

export type DespesaCreateDTO = z.infer<typeof despesaCreateSchema>


export const despesaUpdateSchema = z.object({
    contaId: z.string().optional(),
    cartaoId: z.string().optional(),
    categoryId: z.string().optional(),
    descricao: z.string().min(1, { message: 'Descrição inválida' }).optional(),
    valor: z.coerce.number().min(0.01, { message: 'Valor deve ser maior que zero' }).optional(),
    metodoPagamento: z.enum(['PIX', 'CREDITO', 'DEBITO', 'DINHERO']).optional(),
    data: z.coerce.date().optional(),
    parcelado: z.boolean().optional(),
    numeroParcelas: z.coerce.number().min(1).optional(),
    juros: z.coerce.number().min(0).optional(),
    observacoes: z.string().optional().transform(obs => obs?.trim() || undefined),
})

export type DespesaUpdateDTO = z.infer<typeof despesaUpdateSchema>
