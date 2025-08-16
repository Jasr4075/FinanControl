"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarTokenSchema = void 0;
const zod_1 = require("zod");
exports.gerarTokenSchema = zod_1.z.object({
    system: zod_1.z.string({
        required_error: 'O campo system é obrigatório.',
        invalid_type_error: 'O campo system deve ser uma string.',
    }).nonempty('O campo system não pode ser vazio.'),
});
