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
exports.deleteDespesa = exports.updateDespesa = exports.getDespesaById = exports.getDespesas = exports.createDespesa = void 0;
const DespesaService_1 = require("../services/DespesaService");
const createDespesa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const despesa = yield DespesaService_1.DespesaService.create(req.body);
        res.status(201).json({ success: true, data: despesa });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createDespesa = createDespesa;
const getDespesas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const despesas = yield DespesaService_1.DespesaService.getAll();
        res.status(200).json({ success: true, data: despesas });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getDespesas = getDespesas;
const getDespesaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const despesa = yield DespesaService_1.DespesaService.getById(id);
        res.status(200).json({ success: true, data: despesa });
    }
    catch (error) {
        res.status(error.message === 'Despesa não encontrada.' ? 404 : 500).json({ success: false, message: error.message });
    }
});
exports.getDespesaById = getDespesaById;
const updateDespesa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const despesaAtualizada = yield DespesaService_1.DespesaService.update(id, req.body);
        res.status(200).json({ success: true, data: despesaAtualizada });
    }
    catch (error) {
        res.status(error.message === 'Despesa não encontrada.' ? 404 : 400).json({ success: false, message: error.message });
    }
});
exports.updateDespesa = updateDespesa;
const deleteDespesa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resultado = yield DespesaService_1.DespesaService.delete(id);
        res.status(200).json({ success: true, message: resultado.message });
    }
    catch (error) {
        res.status(error.message === 'Despesa não encontrada.' ? 404 : 500).json({ success: false, message: error.message });
    }
});
exports.deleteDespesa = deleteDespesa;
