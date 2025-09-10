"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartaoCreateSchema = void 0;
const zod_1 = require("zod");
exports.cartaoCreateSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .min(1, { message: 'Usuário é obrigatório' }),
    contaId: zod_1.z.string()
        .min(1, { message: 'Conta é obrigatória' }),
    nome: zod_1.z.string()
        .min(1, { message: 'Nome é obrigatório' }),
    type: zod_1.z.enum(['CREDITO', 'DEBITO', 'MISTO'], {
        required_error: 'Tipo de cartão é obrigatório',
        invalid_type_error: 'Tipo de cartão inválido',
    }),
    hasCashback: zod_1.z.boolean().optional().default(false),
    cashbackPercent: zod_1.z.number()
        .min(0, 'Percentual de cashback não pode ser negativo')
        .optional()
        .default(0),
    creditLimit: zod_1.z.number()
        .min(0, 'Limite não pode ser negativo')
        .optional()
        .default(0),
    closingDay: zod_1.z.coerce.number().min(1).max(28).optional(),
    dueDay: zod_1.z.coerce.number().min(1).max(28).optional(),
    active: zod_1.z.boolean().optional().default(true),
}).refine((data) => {
    if (data.type === 'CREDITO' || data.type === 'MISTO') {
        return data.closingDay !== undefined && data.dueDay !== undefined;
    }
    return true;
}, {
    message: 'closingDay e dueDay são obrigatórios para cartões de crédito ou misto',
    path: ['closingDay'], // aparece o erro nesses campos
});
