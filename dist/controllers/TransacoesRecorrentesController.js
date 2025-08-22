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
exports.deleteTransacaoRecorrente = exports.updateTransacaoRecorrente = exports.getTransacaoRecorrenteById = exports.getTransacoesRecorrentes = exports.createTransacaoRecorrente = void 0;
const TransacoesRecorrentesService_1 = require("../services/TransacoesRecorrentesService");
const transacoesRecorrentes_schema_1 = require("../validators/transacoesRecorrentes.schema");
const zod_1 = require("zod");
// --- Criar transação recorrente ---
const createTransacaoRecorrente = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = transacoesRecorrentes_schema_1.transacaoRecorrenteCreateSchema.parse(req.body);
        const transacao = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.create(validated);
        res.status(201).json({ success: true, data: transacao });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.createTransacaoRecorrente = createTransacaoRecorrente;
// --- Listar todas ---
const getTransacoesRecorrentes = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacoes = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.getAll();
        res.status(200).json({ success: true, data: transacoes });
    }
    catch (error) {
        next(error);
    }
});
exports.getTransacoesRecorrentes = getTransacoesRecorrentes;
// --- Buscar por ID ---
const getTransacaoRecorrenteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacao = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.getById(req.params.id);
        if (!transacao)
            return res.status(404).json({ success: false, message: 'Transação recorrente não encontrada.' });
        res.status(200).json({ success: true, data: transacao });
    }
    catch (error) {
        next(error);
    }
});
exports.getTransacaoRecorrenteById = getTransacaoRecorrenteById;
// --- Atualizar ---
const updateTransacaoRecorrente = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = transacoesRecorrentes_schema_1.transacaoRecorrenteUpdateSchema.parse(req.body);
        const transacao = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.update(req.params.id, validated);
        if (!transacao)
            return res.status(404).json({ success: false, message: 'Transação recorrente não encontrada.' });
        res.status(200).json({ success: true, data: transacao });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.updateTransacaoRecorrente = updateTransacaoRecorrente;
// --- Deletar ---
const deleteTransacaoRecorrente = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.delete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'Transação recorrente não encontrada.' });
        res.status(200).json({ success: true, message: 'Transação recorrente excluída com sucesso.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTransacaoRecorrente = deleteTransacaoRecorrente;
