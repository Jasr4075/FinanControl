"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receitaUpdateSchema = exports.receitaCreateSchema = void 0;
const zod_1 = require("zod");
exports.receitaCreateSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .min(1, { message: 'Usuário é obrigatório' }),
    accountId: zod_1.z.string()
        .min(1, { message: 'Conta é obrigatória' }),
    categoryId: zod_1.z.string()
        .min(1, { message: 'Categoria é obrigatória' }),
    description: zod_1.z.string()
        .min(1, { message: 'Descrição é obrigatória' })
        .max(255, { message: 'Descrição muito longa' }),
    quantidade: zod_1.z.coerce.number({
        required_error: 'Quantidade é obrigatória',
        invalid_type_error: 'Quantidade inválida',
    })
        .min(0.01, { message: 'Quantidade deve ser maior que zero' }),
    data: zod_1.z.coerce.date({
        required_error: 'Data é obrigatória',
        invalid_type_error: 'Data inválida',
    }),
    nota: zod_1.z.string().optional(),
});
exports.receitaUpdateSchema = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    accountId: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    description: zod_1.z.string().max(255).optional(),
    quantidade: zod_1.z.coerce.number().min(0.01, { message: 'Quantidade deve ser maior que zero' }).optional(),
    data: zod_1.z.coerce.date().optional(),
    nota: zod_1.z.string().nullable().optional(),
});
