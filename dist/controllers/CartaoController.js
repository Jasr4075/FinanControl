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
const createCartao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartao = yield CartaoService_1.CartaoService.create(req.body);
        res.status(201).json({ success: true, data: cartao });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createCartao = createCartao;
const getCartoes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartoes = yield CartaoService_1.CartaoService.findAll();
        res.status(200).json({ success: true, data: cartoes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCartoes = getCartoes;
const getCartaoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartao = yield CartaoService_1.CartaoService.findById(req.params.id);
        if (!cartao)
            return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
        res.status(200).json({ success: true, data: cartao });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCartaoById = getCartaoById;
const updateCartao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartao = yield CartaoService_1.CartaoService.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: cartao });
    }
    catch (error) {
        if (error.message === 'Cartão não encontrado.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateCartao = updateCartao;
const deleteCartao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CartaoService_1.CartaoService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Cartão excluído com sucesso.' });
    }
    catch (error) {
        if (error.message === 'Cartão não encontrado.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteCartao = deleteCartao;
