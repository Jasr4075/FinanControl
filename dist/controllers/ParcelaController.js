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
exports.deleteParcela = exports.updateParcela = exports.getParcelaById = exports.getParcelas = exports.createParcela = void 0;
const ParcelaService_1 = require("../services/ParcelaService");
const createParcela = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcela = yield ParcelaService_1.ParcelaService.create(req.body);
        res.status(201).json({ success: true, data: parcela });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createParcela = createParcela;
const getParcelas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelas = yield ParcelaService_1.ParcelaService.findAll();
        res.status(200).json({ success: true, data: parcelas });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getParcelas = getParcelas;
const getParcelaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcela = yield ParcelaService_1.ParcelaService.findById(req.params.id);
        if (!parcela)
            return res.status(404).json({ success: false, message: 'Parcela não encontrada.' });
        res.status(200).json({ success: true, data: parcela });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getParcelaById = getParcelaById;
const updateParcela = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcela = yield ParcelaService_1.ParcelaService.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: parcela });
    }
    catch (error) {
        if (error.message === 'Parcela não encontrada.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateParcela = updateParcela;
const deleteParcela = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ParcelaService_1.ParcelaService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Parcela excluída com sucesso.' });
    }
    catch (error) {
        if (error.message === 'Parcela não encontrada.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteParcela = deleteParcela;
