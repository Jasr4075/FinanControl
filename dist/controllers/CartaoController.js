"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartao = exports.updateCartao = exports.getCartaoById = exports.getCartoes = exports.createCartao = void 0;
const CartaoService_1 = require("../services/CartaoService");
const cartao_schema_1 = require("../validators/cartao.schema");
const zod_1 = require("zod");
// --- Criar cartão ---
const createCartao = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCartao = cartao_schema_1.cartaoCreateSchema.parse(req.body);
        const cartao = yield CartaoService_1.CartaoService.create(validatedCartao);
        res.status(201).json({ success: true, data: cartao });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.createCartao = createCartao;
// --- Listar todos os cartões ---
const getCartoes = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartoes = yield CartaoService_1.CartaoService.findAll();
        res.status(200).json({ success: true, data: cartoes });
    }
    catch (error) {
        next(error);
    }
});
exports.getCartoes = getCartoes;
// --- Buscar cartão por ID ---
const getCartaoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartao = yield CartaoService_1.CartaoService.findById(req.params.id);
        if (!cartao)
            return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
        res.status(200).json({ success: true, data: cartao });
    }
    catch (error) {
        next(error);
    }
});
exports.getCartaoById = getCartaoById;
// --- Atualizar cartão ---
const updateCartao = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aqui você pode criar um schema de update opcional, se quiser validação parcial
        const cartao = yield CartaoService_1.CartaoService.update(req.params.id, req.body);
        if (!cartao)
            return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
        res.status(200).json({ success: true, data: cartao });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCartao = updateCartao;
// --- Deletar cartão ---
const deleteCartao = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield CartaoService_1.CartaoService.delete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
        res.status(200).json({ success: true, message: 'Cartão excluído com sucesso.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCartao = deleteCartao;
