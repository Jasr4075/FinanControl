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
exports.deleteCartao = exports.updateCartao = exports.getCartaoResumo = exports.getCartaoById = exports.getCartoes = exports.createCartao = void 0;
const CartaoService_1 = require("../services/CartaoService");
const cartao_schema_1 = require("../validators/cartao.schema");
const zod_1 = require("zod");
const redisClient_1 = require("../redisClient");
const CACHE_TTL = 3600;
function refreshCartaoCache(cartaoId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cartaoId) {
            const cartao = yield CartaoService_1.CartaoService.findById(cartaoId);
            if (cartao) {
                yield redisClient_1.redisClient.set(`cartao:${cartaoId}`, JSON.stringify(cartao), { EX: CACHE_TTL });
                const resumo = yield CartaoService_1.CartaoService.resumo(cartaoId);
                yield redisClient_1.redisClient.set(`cartaoResumo:${cartaoId}`, JSON.stringify(resumo), { EX: CACHE_TTL });
            }
        }
        if (userId) {
            const cartoes = yield CartaoService_1.CartaoService.findAllByUser(userId);
            yield redisClient_1.redisClient.set(`cartoes:${userId}`, JSON.stringify(cartoes), { EX: CACHE_TTL });
        }
    });
}
const createCartao = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUser = req.user;
        const userId = (authUser === null || authUser === void 0 ? void 0 : authUser.id) || (authUser === null || authUser === void 0 ? void 0 : authUser.userId) || (authUser === null || authUser === void 0 ? void 0 : authUser.sub);
        if (!userId)
            return res.status(400).json({ success: false, message: 'Usuário não identificado.' });
        const payload = Object.assign(Object.assign({}, req.body), { userId, creditLimit: req.body.creditLimit !== undefined ? Number(req.body.creditLimit) : undefined, cashbackPercent: req.body.cashbackPercent !== undefined ? Number(req.body.cashbackPercent) : undefined });
        const validatedCartao = cartao_schema_1.cartaoCreateSchema.parse(payload);
        const cartao = yield CartaoService_1.CartaoService.create(validatedCartao);
        yield refreshCartaoCache(cartao === null || cartao === void 0 ? void 0 : cartao.id, userId);
        res.status(201).json({ success: true, data: cartao });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError)
            return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
});
exports.createCartao = createCartao;
const getCartoes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.userId) || (user === null || user === void 0 ? void 0 : user.sub);
        if (!userId)
            return res.status(400).json({ success: false, message: 'Usuário não identificado no token.' });
        const cacheKey = `cartoes:${userId}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const cartoes = yield CartaoService_1.CartaoService.findAllByUser(userId);
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(cartoes), { EX: CACHE_TTL });
        res.status(200).json({ success: true, data: cartoes });
    }
    catch (error) {
        next(error);
    }
});
exports.getCartoes = getCartoes;
const getCartaoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = `cartao:${req.params.id}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const cartao = yield CartaoService_1.CartaoService.findById(req.params.id);
        if (!cartao)
            return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(cartao), { EX: CACHE_TTL });
        res.status(200).json({ success: true, data: cartao });
    }
    catch (error) {
        next(error);
    }
});
exports.getCartaoById = getCartaoById;
const getCartaoResumo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = `cartaoResumo:${req.params.id}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const resumo = yield CartaoService_1.CartaoService.resumo(req.params.id);
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(resumo), { EX: CACHE_TTL });
        res.status(200).json({ success: true, data: resumo });
    }
    catch (error) {
        next(error);
    }
});
exports.getCartaoResumo = getCartaoResumo;
const updateCartao = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartao = yield CartaoService_1.CartaoService.update(req.params.id, req.body);
        if (!cartao)
            return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
        yield refreshCartaoCache(cartao.id, cartao.userId);
        res.status(200).json({ success: true, data: cartao });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCartao = updateCartao;
const deleteCartao = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartao = yield CartaoService_1.CartaoService.findById(req.params.id);
        if (!cartao)
            return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
        const userId = cartao.userId;
        yield CartaoService_1.CartaoService.delete(req.params.id);
        yield refreshCartaoCache(undefined, userId);
        yield redisClient_1.redisClient.del(`cartao:${req.params.id}`);
        yield redisClient_1.redisClient.del(`cartaoResumo:${req.params.id}`);
        res.status(200).json({ success: true, message: 'Cartão excluído com sucesso.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCartao = deleteCartao;
