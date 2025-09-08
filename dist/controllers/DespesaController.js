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
exports.getDespesasMesAtual = exports.getUltimasDespesas = exports.getTotalDespesasMes = exports.deleteDespesa = exports.updateDespesa = exports.getDespesaById = exports.getDespesas = exports.createDespesa = void 0;
const DespesaService_1 = require("../services/DespesaService");
const despesa_schema_1 = require("../validators/despesa.schema");
const zod_1 = require("zod");
// --- Criar despesa ---
const createDespesa = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const despesaValidated = despesa_schema_1.despesaCreateSchema.parse(req.body);
        const despesa = yield DespesaService_1.DespesaService.create(despesaValidated);
        res.status(201).json({ success: true, data: despesa });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.createDespesa = createDespesa;
// --- Listar todas ---
const getDespesas = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const despesas = yield DespesaService_1.DespesaService.getAll();
        res.status(200).json({ success: true, data: despesas });
    }
    catch (error) {
        next(error);
    }
});
exports.getDespesas = getDespesas;
// --- Buscar por ID ---
const getDespesaById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const despesa = yield DespesaService_1.DespesaService.getById(id);
        if (!despesa)
            return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
        res.status(200).json({ success: true, data: despesa });
    }
    catch (error) {
        next(error);
    }
});
exports.getDespesaById = getDespesaById;
// --- Atualizar despesa ---
const updateDespesa = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const despesaValidated = despesa_schema_1.despesaUpdateSchema.parse(req.body);
        const despesaAtualizada = yield DespesaService_1.DespesaService.update(id, despesaValidated);
        if (!despesaAtualizada)
            return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
        res.status(200).json({ success: true, data: despesaAtualizada });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.updateDespesa = updateDespesa;
// --- Deletar despesa ---
const deleteDespesa = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield DespesaService_1.DespesaService.delete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
        res.status(200).json({ success: true, message: 'Despesa excluída com sucesso.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteDespesa = deleteDespesa;
const getTotalDespesasMes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ano, mes } = req.query;
        let total;
        if (ano && mes) {
            const anoNum = Number(ano);
            const mesNum = Number(mes);
            if (!anoNum || !mesNum || mesNum < 1 || mesNum > 12) {
                return res.status(400).json({ success: false, message: 'Parâmetros ano/mes inválidos.' });
            }
            total = yield DespesaService_1.DespesaService.getTotalByMonth(req.params.userId, anoNum, mesNum);
        }
        else {
            total = yield DespesaService_1.DespesaService.getTotalMes(req.params.userId);
        }
        res.status(200).json({ success: true, total });
    }
    catch (error) {
        next(error);
    }
});
exports.getTotalDespesasMes = getTotalDespesasMes;
const getUltimasDespesas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const despesas = yield DespesaService_1.DespesaService.getUltimas(req.params.userId, 15);
        res.status(200).json({ success: true, data: despesas });
    }
    catch (error) {
        next(error);
    }
});
exports.getUltimasDespesas = getUltimasDespesas;
const getDespesasMesAtual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const despesas = yield DespesaService_1.DespesaService.getMesAtual(req.params.userId);
        res.status(200).json({ success: true, data: despesas });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getDespesasMesAtual = getDespesasMesAtual;
