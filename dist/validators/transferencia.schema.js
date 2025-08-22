"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferenciaUpdateSchema = exports.transferenciaCreateSchema = void 0;
const zod_1 = require("zod");
exports.transferenciaCreateSchema = zod_1.z.object({
    fromAccountId: zod_1.z.string()
        .min(1, { message: 'Conta de origem é obrigatória' }),
    toAccountId: zod_1.z.string()
        .min(1, { message: 'Conta de destino é obrigatória' }),
    amount: zod_1.z.coerce.number({
        required_error: 'Valor é obrigatório',
        invalid_type_error: 'Valor inválido',
    }).min(0.01, { message: 'O valor deve ser maior que zero' }),
    date: zod_1.z.coerce.date().optional(),
    description: zod_1.z.string()
        .max(255, { message: 'Descrição muito longa' })
        .optional(),
});
exports.transferenciaUpdateSchema = zod_1.z.object({
    fromAccountId: zod_1.z.string().optional(),
    toAccountId: zod_1.z.string().optional(),
    amount: zod_1.z.coerce.number().min(0.01).optional(),
    date: zod_1.z.coerce.date().optional(),
    description: zod_1.z.string().max(255).optional(),
});
