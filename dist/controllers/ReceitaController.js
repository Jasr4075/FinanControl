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
exports.deleteReceita = exports.updateReceita = exports.getReceitaById = exports.getReceitas = exports.createReceita = void 0;
const ReceitaService_1 = require("../services/ReceitaService");
const createReceita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, accountId, categoryId, description, quantidade, data, nota } = req.body;
        if (!userId || !accountId || !categoryId || !description || !quantidade || !data) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos.' });
        }
        const novaReceita = yield ReceitaService_1.ReceitaService.create({
            userId,
            accountId,
            categoryId,
            description,
            quantidade,
            data,
            nota,
        });
        res.status(201).json({ success: true, data: novaReceita });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createReceita = createReceita;
const getReceitas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receitas = yield ReceitaService_1.ReceitaService.findAll();
        res.status(200).json({ success: true, data: receitas });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getReceitas = getReceitas;
const getReceitaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receita = yield ReceitaService_1.ReceitaService.findById(req.params.id);
        if (!receita) {
            return res.status(404).json({ success: false, message: 'Receita não encontrada.' });
        }
        res.status(200).json({ success: true, data: receita });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getReceitaById = getReceitaById;
const updateReceita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receitaAtualizada = yield ReceitaService_1.ReceitaService.update(req.params.id, req.body);
        if (!receitaAtualizada) {
            return res.status(404).json({ success: false, message: 'Receita não encontrada.' });
        }
        res.status(200).json({ success: true, data: receitaAtualizada });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateReceita = updateReceita;
const deleteReceita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletada = yield ReceitaService_1.ReceitaService.delete(req.params.id);
        if (!deletada) {
            return res.status(404).json({ success: false, message: 'Receita não encontrada.' });
        }
        res.status(200).json({ success: true, message: 'Receita excluída com sucesso.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteReceita = deleteReceita;
