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
const transferencia_schema_1 = require("../validators/transferencia.schema");
const zod_1 = require("zod");
// --- Criar transferência ---
const createTransferencia = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = transferencia_schema_1.transferenciaCreateSchema.parse(req.body);
        const transferencia = yield TransferenciaService_1.transferenciaService.create(validated);
        res.status(201).json({ success: true, data: transferencia });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.createTransferencia = createTransferencia;
// --- Listar todas ---
const getTransferencias = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencias = yield TransferenciaService_1.transferenciaService.getAll();
        res.status(200).json({ success: true, data: transferencias });
    }
    catch (error) {
        next(error);
    }
});
exports.getTransferencias = getTransferencias;
// --- Buscar por ID ---
const getTransferenciaById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencia = yield TransferenciaService_1.transferenciaService.getById(req.params.id);
        if (!transferencia)
            return res.status(404).json({ success: false, message: 'Transferência não encontrada.' });
        res.status(200).json({ success: true, data: transferencia });
    }
    catch (error) {
        next(error);
    }
});
exports.getTransferenciaById = getTransferenciaById;
// --- Atualizar ---
const updateTransferencia = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = transferencia_schema_1.transferenciaUpdateSchema.parse(req.body);
        const transferencia = yield TransferenciaService_1.transferenciaService.update(req.params.id, validated);
        if (!transferencia)
            return res.status(404).json({ success: false, message: 'Transferência não encontrada.' });
        res.status(200).json({ success: true, data: transferencia });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.updateTransferencia = updateTransferencia;
// --- Deletar ---
const deleteTransferencia = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield TransferenciaService_1.transferenciaService.delete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'Transferência não encontrada.' });
        res.status(200).json({ success: true, message: 'Transferência excluída com sucesso.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTransferencia = deleteTransferencia;
