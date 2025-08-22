"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashbackUpdateSchema = exports.cashbackCreateSchema = void 0;
const zod_1 = require("zod");
exports.cashbackCreateSchema = zod_1.z.object({
    cartaoId: zod_1.z.string()
        .min(1, { message: 'Cartão é obrigatório' }),
    quantidade: zod_1.z.coerce.number({
        required_error: 'Quantidade é obrigatória',
        invalid_type_error: 'Quantidade inválida',
    })
        .min(0.01, { message: 'Quantidade deve ser maior que zero' }),
    description: zod_1.z.string()
        .min(1, { message: 'Descrição é obrigatória' }),
    despesaId: zod_1.z.string()
        .min(1, { message: 'Despesa é obrigatória' }),
    creditDate: zod_1.z.coerce.date({
        required_error: 'Data de crédito é obrigatória',
        invalid_type_error: 'Data de crédito inválida',
    }),
});
exports.cashbackUpdateSchema = zod_1.z.object({
    cartaoId: zod_1.z.string().optional(),
    quantidade: zod_1.z.coerce.number().min(0.01, { message: 'Quantidade deve ser maior que zero' }).optional(),
    description: zod_1.z.string().min(1, { message: 'Descrição inválida' }).optional(),
    despesaId: zod_1.z.string().optional(),
    creditDate: zod_1.z.coerce.date().optional(),
});
