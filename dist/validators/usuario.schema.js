"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioUpdateSchema = exports.usuarioCreateSchema = void 0;
const zod_1 = require("zod");
exports.usuarioCreateSchema = zod_1.z.object({
    nome: zod_1.z.string()
        .min(1, 'Nome é obrigatório')
        .transform(nome => nome.trim()),
    email: zod_1.z.string()
        .min(1, 'Email é obrigatório')
        .email('Formato de email inválido')
        .transform((email) => email.trim()),
    telefone: zod_1.z.string()
        .min(8, 'Telefone inválido')
        .transform(telefone => telefone.trim()),
    username: zod_1.z.string()
        .min(3, 'Username deve ter pelo menos 3 caracteres')
        .transform(username => username.trim()),
    senha: zod_1.z.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .transform(senha => senha.trim()),
});
exports.usuarioUpdateSchema = zod_1.z.object({
    nome: zod_1.z.string()
        .min(1, 'Nome não pode ser vazio')
        .optional()
        .transform(nome => nome === null || nome === void 0 ? void 0 : nome.trim()),
    email: zod_1.z.string()
        .min(1, 'Email é obrigatório')
        .email('Formato de email inválido')
        .transform(email => email.trim()),
    telefone: zod_1.z.string()
        .min(8, 'Telefone inválido')
        .optional()
        .transform(telefone => telefone === null || telefone === void 0 ? void 0 : telefone.trim()),
    username: zod_1.z.string()
        .min(3, 'Username deve ter pelo menos 3 caracteres')
        .optional()
        .transform(username => username === null || username === void 0 ? void 0 : username.trim()),
    senha: zod_1.z.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .optional()
        .transform(senha => senha === null || senha === void 0 ? void 0 : senha.trim()),
});
