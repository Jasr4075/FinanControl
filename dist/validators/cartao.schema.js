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
    hasCashback: zod_1.z.boolean()
        .optional()
        .default(false),
    cashbackPercent: zod_1.z.number()
        .min(0, 'Percentual de cashback não pode ser negativo')
        .optional()
        .default(0),
    creditLimit: zod_1.z.number()
        .min(0, 'Limite não pode ser negativo')
        .optional()
        .default(0),
    closingDay: zod_1.z.coerce.number({
        required_error: 'Dia de fechamento é obrigatório',
        invalid_type_error: 'Dia de fechamento inválido',
    })
        .min(1, { message: 'Dia de fechamento inválido' })
        .max(28, { message: 'Dia de fechamento deve ser até 28' }),
    dueDay: zod_1.z.coerce.number({
        required_error: 'Dia de vencimento é obrigatório',
        invalid_type_error: 'Dia de vencimento inválido',
    })
        .min(1, { message: 'Dia de vencimento inválido' })
        .max(28, { message: 'Dia de vencimento deve ser até 28' }),
    active: zod_1.z.boolean()
        .optional()
        .default(true),
});
