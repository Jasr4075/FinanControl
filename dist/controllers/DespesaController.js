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
exports.deleteDespesa = exports.updateDespesa = exports.createDespesa = exports.getTotalDespesasMes = exports.getDespesasMesAtual = exports.getUltimasDespesas = exports.getDespesaById = void 0;
const DespesaService_1 = require("../services/DespesaService");
const despesa_schema_1 = require("../validators/despesa.schema");
const zod_1 = require("zod");
const redisClient_1 = require("../redisClient");
const CACHE_TTL_SHORT = 5;
const CACHE_TTL_LONG = 15;
const getDespesaById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = `despesa:${req.params.id}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached)
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        const despesa = yield DespesaService_1.DespesaService.getById(req.params.id);
        if (!despesa)
            return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
        yield redisClient_1.redisClient.setEx(cacheKey, CACHE_TTL_LONG, JSON.stringify(despesa));
        res.status(200).json({ success: true, data: despesa });
    }
    catch (error) {
        next(error);
    }
});
exports.getDespesaById = getDespesaById;
const getUltimasDespesas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const cacheKey = `ultimasDespesas:${userId}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached)
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        const despesas = yield DespesaService_1.DespesaService.getUltimas(userId, 15);
        yield redisClient_1.redisClient.setEx(cacheKey, CACHE_TTL_SHORT, JSON.stringify(despesas));
        res.status(200).json({ success: true, data: despesas });
    }
    catch (error) {
        next(error);
    }
});
exports.getUltimasDespesas = getUltimasDespesas;
const getDespesasMesAtual = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const cacheKey = `despesasMesAtual:${userId}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached)
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        const despesas = yield DespesaService_1.DespesaService.getMesAtual(userId);
        yield redisClient_1.redisClient.setEx(cacheKey, CACHE_TTL_SHORT, JSON.stringify(despesas));
        res.status(200).json({ success: true, data: despesas });
    }
    catch (error) {
        next(error);
    }
});
exports.getDespesasMesAtual = getDespesasMesAtual;
const getTotalDespesasMes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ano, mes } = req.query;
        const userId = req.params.userId;
        const cacheKey = ano && mes ? `totalDespesas:${userId}:${ano}-${mes}` : `totalDespesas:${userId}:mesAtual`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached)
            return res.status(200).json({ success: true, total: Number(cached) });
        let total;
        if (ano && mes) {
            total = yield DespesaService_1.DespesaService.getTotalByMonth(userId, Number(ano), Number(mes));
        }
        else {
            total = yield DespesaService_1.DespesaService.getTotalMes(userId);
        }
        yield redisClient_1.redisClient.setEx(cacheKey, CACHE_TTL_SHORT, total.toString());
        res.status(200).json({ success: true, total });
    }
    catch (error) {
        next(error);
    }
});
exports.getTotalDespesasMes = getTotalDespesasMes;
const createDespesa = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = despesa_schema_1.despesaCreateSchema.parse(req.body);
        const despesa = yield DespesaService_1.DespesaService.create(data);
        // invalidar caches relacionados ao usuário
        const userId = data.userId;
        yield redisClient_1.redisClient.del(`ultimasDespesas:${userId}`);
        yield redisClient_1.redisClient.del(`despesasMesAtual:${userId}`);
        yield redisClient_1.redisClient.del(`totalDespesas:${userId}:mesAtual`);
        res.status(201).json({ success: true, data: despesa });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError)
            return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
});
exports.createDespesa = createDespesa;
const updateDespesa = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = despesa_schema_1.despesaUpdateSchema.parse(req.body);
        const despesa = yield DespesaService_1.DespesaService.update(req.params.id, data);
        if (!despesa) {
            return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
        }
        // invalidar caches relacionados ao usuário
        const userId = despesa.userId;
        yield redisClient_1.redisClient.del(`ultimasDespesas:${userId}`);
        yield redisClient_1.redisClient.del(`despesasMesAtual:${userId}`);
        yield redisClient_1.redisClient.del(`totalDespesas:${userId}:mesAtual`);
        yield redisClient_1.redisClient.del(`despesa:${req.params.id}`);
        res.status(200).json({ success: true, data: despesa });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError)
            return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
});
exports.updateDespesa = updateDespesa;
const deleteDespesa = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const despesa = yield DespesaService_1.DespesaService.delete(req.params.id);
        if (!despesa) {
            return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
        }
        const userId = despesa.userId; // pegar do registro deletado
        // invalidar caches relacionados ao usuário
        yield redisClient_1.redisClient.del(`ultimasDespesas:${userId}`);
        yield redisClient_1.redisClient.del(`despesasMesAtual:${userId}`);
        yield redisClient_1.redisClient.del(`totalDespesas:${userId}:mesAtual`);
        yield redisClient_1.redisClient.del(`despesa:${req.params.id}`);
        res.status(200).json({ success: true, message: 'Despesa excluída com sucesso.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteDespesa = deleteDespesa;
