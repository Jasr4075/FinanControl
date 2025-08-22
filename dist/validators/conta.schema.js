"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contaUpdateSchema = exports.contaCreateSchema = void 0;
const zod_1 = require("zod");
exports.contaCreateSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .min(1, 'Usuário é obrigatório'),
    type: zod_1.z.enum(['CORRENTE', 'POUPANCA', 'EFETIVO'], {
        errorMap: () => ({ message: 'Tipo de conta inválido' }),
    }),
    bancoNome: zod_1.z.string()
        .min(1, 'Nome do banco é obrigatório')
        .transform(nome => nome.trim()),
    agencia: zod_1.z.string()
        .min(1, 'Agência é obrigatória')
        .transform(agencia => agencia.trim()),
    conta: zod_1.z.string()
        .min(1, 'Conta é obrigatória')
        .transform(conta => conta.trim()),
    saldo: zod_1.z.number()
        .min(0, 'Saldo não pode ser negativo')
        .optional()
        .default(0),
    efetivo: zod_1.z.boolean()
        .optional()
        .default(false),
    cdiPercent: zod_1.z.number()
        .min(0, 'CDI Percentual não pode ser negativo')
        .optional()
        .default(0),
});
exports.contaUpdateSchema = zod_1.z.object({
    type: zod_1.z.enum(['CORRENTE', 'POUPANCA', 'EFETIVO'], {
        errorMap: () => ({ message: 'Tipo de conta inválido' }),
    }).optional(),
    bancoNome: zod_1.z.string()
        .min(1, 'Nome do banco não pode ser vazio')
        .transform(nome => nome.trim())
        .optional(),
    agencia: zod_1.z.string()
        .min(1, 'Agência inválida')
        .transform(agencia => agencia.trim())
        .optional(),
    conta: zod_1.z.string()
        .min(1, 'Conta inválida')
        .transform(conta => conta.trim())
        .optional(),
    saldo: zod_1.z.number()
        .min(0, 'Saldo não pode ser negativo')
        .optional(),
    efetivo: zod_1.z.boolean()
        .optional(),
    cdiPercent: zod_1.z.number()
        .min(0, 'CDI Percentual não pode ser negativo')
        .optional(),
});
