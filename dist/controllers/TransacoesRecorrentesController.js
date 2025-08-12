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
const createTransacaoRecorrente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacao = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.create(req.body);
        res.status(201).json({ success: true, data: transacao });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createTransacaoRecorrente = createTransacaoRecorrente;
const getTransacoesRecorrentes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacoes = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.getAll();
        res.status(200).json({ success: true, data: transacoes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getTransacoesRecorrentes = getTransacoesRecorrentes;
const getTransacaoRecorrenteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacao = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.getById(req.params.id);
        res.status(200).json({ success: true, data: transacao });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});
exports.getTransacaoRecorrenteById = getTransacaoRecorrenteById;
const updateTransacaoRecorrente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacao = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: transacao });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateTransacaoRecorrente = updateTransacaoRecorrente;
const deleteTransacaoRecorrente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TransacoesRecorrentesService_1.TransacoesRecorrentesService.delete(req.params.id);
        res.status(200).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});
exports.deleteTransacaoRecorrente = deleteTransacaoRecorrente;
