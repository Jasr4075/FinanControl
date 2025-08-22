"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transacaoRecorrenteUpdateSchema = exports.transacaoRecorrenteCreateSchema = void 0;
const zod_1 = require("zod");
exports.transacaoRecorrenteCreateSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .min(1, { message: 'Usuário é obrigatório' }),
    type: zod_1.z.enum(['Despesa', 'Receita'], {
        required_error: 'Tipo da transação é obrigatório',
        invalid_type_error: 'Tipo deve ser "Despesa" ou "Receita"',
    }),
    amount: zod_1.z.coerce.number({
        required_error: 'Valor é obrigatório',
        invalid_type_error: 'Valor inválido',
    })
        .min(0.01, { message: 'O valor deve ser maior que zero' }),
    descricao: zod_1.z.string()
        .min(1, { message: 'Descrição é obrigatória' })
        .max(255, { message: 'Descrição muito longa' }),
    frequencia: zod_1.z.enum(['diario', 'semanal', 'mensal'], {
        required_error: 'Frequência é obrigatória',
        invalid_type_error: 'Frequência deve ser "diario", "semanal" ou "mensal"',
    }),
    dataInicio: zod_1.z.coerce.date({
        required_error: 'Data de início é obrigatória',
        invalid_type_error: 'Data de início inválida',
    }),
    dataFinal: zod_1.z.coerce.date().nullable().optional(),
    categoryId: zod_1.z.string()
        .min(1, { message: 'Categoria é obrigatória' }),
    active: zod_1.z.boolean().optional(),
});
exports.transacaoRecorrenteUpdateSchema = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    type: zod_1.z.enum(['Despesa', 'Receita']).optional(),
    amount: zod_1.z.coerce.number().min(0.01).optional(),
    descricao: zod_1.z.string().max(255).optional(),
    frequencia: zod_1.z.enum(['diario', 'semanal', 'mensal']).optional(),
    dataInicio: zod_1.z.coerce.date().optional(),
    dataFinal: zod_1.z.coerce.date().nullable().optional(),
    categoryId: zod_1.z.string().optional(),
    active: zod_1.z.boolean().optional(),
});
