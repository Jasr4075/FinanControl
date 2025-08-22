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
exports.deleteFatura = exports.updateFatura = exports.getFaturaById = exports.getFaturas = exports.createFatura = void 0;
const FaturaService_1 = require("../services/FaturaService");
const createFatura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fatura = yield FaturaService_1.FaturaService.create(req.body);
        res.status(201).json({ success: true, data: fatura });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createFatura = createFatura;
const getFaturas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faturas = yield FaturaService_1.FaturaService.getAll();
        res.status(200).json({ success: true, data: faturas });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getFaturas = getFaturas;
const getFaturaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const fatura = yield FaturaService_1.FaturaService.getById(id);
        res.status(200).json({ success: true, data: fatura });
    }
    catch (error) {
        res.status(error.message === 'Fatura não encontrada.' ? 404 : 500).json({ success: false, message: error.message });
    }
});
exports.getFaturaById = getFaturaById;
const updateFatura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const faturaAtualizada = yield FaturaService_1.FaturaService.update(id, req.body);
        res.status(200).json({ success: true, data: faturaAtualizada });
    }
    catch (error) {
        res.status(error.message === 'Fatura não encontrada.' || error.message.startsWith('Mês inválido')
            ? 400
            : 400).json({ success: false, message: error.message });
    }
});
exports.updateFatura = updateFatura;
const deleteFatura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resultado = yield FaturaService_1.FaturaService.delete(id);
        res.status(200).json({ success: true, message: resultado.message });
    }
    catch (error) {
        res.status(error.message === 'Fatura não encontrada.' ? 404 : 500).json({ success: false, message: error.message });
    }
});
exports.deleteFatura = deleteFatura;
