"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaUpdateSchema = exports.metaCreateSchema = void 0;
const zod_1 = require("zod");
exports.metaCreateSchema = zod_1.z.object({
    usuarioId: zod_1.z.string()
        .min(1, { message: 'Usuário é obrigatório' }),
    categoryId: zod_1.z.string()
        .min(1, { message: 'Categoria é obrigatória' }),
    limitAmount: zod_1.z.coerce.number({
        required_error: 'Limite é obrigatório',
        invalid_type_error: 'Limite inválido',
    })
        .min(0.01, { message: 'Limite deve ser maior que zero' }),
    month: zod_1.z.coerce.number({
        required_error: 'Mês é obrigatório',
        invalid_type_error: 'Mês inválido',
    })
        .min(1, { message: 'Mês deve ser entre 1 e 12' })
        .max(12, { message: 'Mês deve ser entre 1 e 12' }),
    year: zod_1.z.coerce.number({
        required_error: 'Ano é obrigatório',
        invalid_type_error: 'Ano inválido',
    })
        .min(1900, { message: 'Ano inválido' }),
});
exports.metaUpdateSchema = zod_1.z.object({
    usuarioId: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    limitAmount: zod_1.z.coerce.number().min(0.01, { message: 'Limite deve ser maior que zero' }).optional(),
    month: zod_1.z.coerce.number().min(1).max(12).optional(),
    year: zod_1.z.coerce.number().min(1900, { message: 'Ano inválido' }).optional(),
});
