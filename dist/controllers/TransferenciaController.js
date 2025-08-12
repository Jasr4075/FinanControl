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
exports.deleteTransferencia = exports.updateTransferencia = exports.getTransferenciaById = exports.getTransferencias = exports.createTransferencia = void 0;
const TransferenciaService_1 = require("../services/TransferenciaService");
const createTransferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencia = yield TransferenciaService_1.transferenciaService.create(req.body);
        res.status(201).json(transferencia);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createTransferencia = createTransferencia;
const getTransferencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencias = yield TransferenciaService_1.transferenciaService.getAll();
        res.status(200).json(transferencias);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTransferencias = getTransferencias;
const getTransferenciaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencia = yield TransferenciaService_1.transferenciaService.getById(req.params.id);
        res.status(200).json(transferencia);
    }
    catch (error) {
        res.status(error.message.includes('não encontrada') ? 404 : 500).json({ message: error.message });
    }
});
exports.getTransferenciaById = getTransferenciaById;
const updateTransferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencia = yield TransferenciaService_1.transferenciaService.update(req.params.id, req.body);
        res.status(200).json(transferencia);
    }
    catch (error) {
        res.status(error.message.includes('não encontrada') ? 404 : 400).json({ message: error.message });
    }
});
exports.updateTransferencia = updateTransferencia;
const deleteTransferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TransferenciaService_1.transferenciaService.delete(req.params.id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(error.message.includes('não encontrada') ? 404 : 500).json({ message: error.message });
    }
});
exports.deleteTransferencia = deleteTransferencia;
