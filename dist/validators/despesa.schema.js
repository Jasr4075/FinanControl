"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.despesaUpdateSchema = exports.despesaCreateSchema = void 0;
const zod_1 = require("zod");
exports.despesaCreateSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .min(1, { message: 'Usuário é obrigatório' }),
    contaId: zod_1.z.string()
        .optional(),
    cartaoId: zod_1.z.string()
        .optional(),
    categoryId: zod_1.z.string()
        .min(1, { message: 'Categoria é obrigatória' }),
    descricao: zod_1.z.string()
        .min(1, { message: 'Descrição é obrigatória' }),
    valor: zod_1.z.coerce.number({
        required_error: 'Valor é obrigatório',
        invalid_type_error: 'Valor inválido',
    })
        .min(0.01, { message: 'Valor deve ser maior que zero' }),
    metodoPagamento: zod_1.z.enum(['DINHEIRO', 'CARTAO', 'PIX', 'BOLETO', 'OUTRO'], {
        required_error: 'Método de pagamento é obrigatório',
        invalid_type_error: 'Método de pagamento inválido',
    }),
    data: zod_1.z.coerce.date({
        required_error: 'Data da despesa é obrigatória',
        invalid_type_error: 'Data inválida',
    }),
    parcelado: zod_1.z.boolean()
        .optional()
        .default(false),
    numeroParcelas: zod_1.z.coerce.number()
        .min(1, { message: 'Número de parcelas deve ser pelo menos 1' })
        .optional()
        .default(1),
    juros: zod_1.z.coerce.number()
        .min(0, { message: 'Juros não pode ser negativo' })
        .optional()
        .default(0),
    observacoes: zod_1.z.string()
        .optional()
        .transform(obs => (obs === null || obs === void 0 ? void 0 : obs.trim()) || undefined),
});
exports.despesaUpdateSchema = zod_1.z.object({
    contaId: zod_1.z.string().optional(),
    cartaoId: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    descricao: zod_1.z.string().min(1, { message: 'Descrição inválida' }).optional(),
    valor: zod_1.z.coerce.number().min(0.01, { message: 'Valor deve ser maior que zero' }).optional(),
    metodoPagamento: zod_1.z.enum(['DINHEIRO', 'CARTAO', 'PIX', 'BOLETO', 'OUTRO']).optional(),
    data: zod_1.z.coerce.date().optional(),
    parcelado: zod_1.z.boolean().optional(),
    numeroParcelas: zod_1.z.coerce.number().min(1).optional(),
    juros: zod_1.z.coerce.number().min(0).optional(),
    observacoes: zod_1.z.string().optional().transform(obs => (obs === null || obs === void 0 ? void 0 : obs.trim()) || undefined),
});
