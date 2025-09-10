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
exports.getContasByUserId = exports.deleteConta = exports.updateConta = exports.getContaById = exports.getContas = exports.createConta = void 0;
const ContaService_1 = require("../services/ContaService");
const conta_schema_1 = require("../validators/conta.schema");
const zod_1 = require("zod");
const redisClient_1 = require("../redisClient");
const CartaoService_1 = require("../services/CartaoService");
const CACHE_TTL = 86400; // 86400 segundos (1 dia)
const createConta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = conta_schema_1.contaCreateSchema.parse(req.body);
        const conta = yield ContaService_1.ContaService.create(data);
        // Invalida cache global de contas
        yield redisClient_1.redisClient.del('contas_all');
        yield redisClient_1.redisClient.del(`contas_user_${data.userId}`);
        res.status(201).json({ success: true, data: conta });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.createConta = createConta;
const getContas = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = 'contas_all';
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            console.log('⚡ Cache HIT - getContas');
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const contas = yield ContaService_1.ContaService.findAll();
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(contas), { EX: CACHE_TTL });
        console.log('💾 Cache SET - getContas');
        res.status(200).json({ success: true, data: contas });
    }
    catch (error) {
        next(error);
    }
});
exports.getContas = getContas;
const getContaById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const cacheKey = `conta_${id}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache HIT - getContaById(${id})`);
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const conta = yield ContaService_1.ContaService.findById(id);
        if (!conta)
            return res.status(404).json({ success: false, message: 'Conta não encontrada.' });
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(conta), { EX: CACHE_TTL });
        console.log(`💾 Cache SET - getContaById(${id})`);
        res.status(200).json({ success: true, data: conta });
    }
    catch (error) {
        next(error);
    }
});
exports.getContaById = getContaById;
const updateConta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = conta_schema_1.contaUpdateSchema.parse(req.body);
        const conta = yield ContaService_1.ContaService.update(req.params.id, data);
        // Invalida cache
        yield redisClient_1.redisClient.del('contas_all');
        yield redisClient_1.redisClient.del(`conta_${req.params.id}`);
        if (conta === null || conta === void 0 ? void 0 : conta.userId)
            yield redisClient_1.redisClient.del(`contas_user_${conta.userId}`);
        res.status(200).json({ success: true, data: conta });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        if (error.message === 'Conta não encontrada.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
});
exports.updateConta = updateConta;
// --- DELETE CONTA ---
const deleteConta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conta = yield ContaService_1.ContaService.findById(req.params.id);
        if (!conta)
            return res.status(404).json({ success: false, message: 'Conta não encontrada.' });
        const userId = conta.userId;
        // Deleta todos os cartões associados à conta
        const cartoes = conta.cartoes || [];
        for (const cartao of cartoes) {
            yield CartaoService_1.CartaoService.delete(cartao.id);
            // Limpa cache individual do cartão
            yield redisClient_1.redisClient.del(`cartao:${cartao.id}`);
            yield redisClient_1.redisClient.del(`cartaoResumo:${cartao.id}`);
        }
        // Deleta a conta
        yield ContaService_1.ContaService.delete(req.params.id);
        // Invalida caches relacionados
        yield redisClient_1.redisClient.del('contas_all');
        yield redisClient_1.redisClient.del(`conta_${req.params.id}`);
        if (userId) {
            yield redisClient_1.redisClient.del(`contas_user_${userId}`);
            yield redisClient_1.redisClient.del(`cartoes:${userId}`);
        }
        res.status(200).json({ success: true, message: 'Conta e cartões associados excluídos com sucesso.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteConta = deleteConta;
const getContasByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const cacheKey = `contas_user_${userId}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache HIT - getContasByUserId(${userId})`);
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const contas = yield ContaService_1.ContaService.findByUserId(userId);
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(contas), { EX: CACHE_TTL });
        console.log(`💾 Cache SET - getContasByUserId(${userId})`);
        res.status(200).json({ success: true, data: contas });
    }
    catch (error) {
        next(error);
    }
});
exports.getContasByUserId = getContasByUserId;
