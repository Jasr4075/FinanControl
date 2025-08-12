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
exports.deleteNotificacao = exports.updateNotificacao = exports.getNotificacaoById = exports.getNotificacoes = exports.createNotificacao = void 0;
const NotificacaoService_1 = require("../services/NotificacaoService");
const createNotificacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificacao = yield NotificacaoService_1.NotificacaoService.create(req.body);
        res.status(201).json(notificacao);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createNotificacao = createNotificacao;
const getNotificacoes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificacoes = yield NotificacaoService_1.NotificacaoService.getAll();
        res.status(200).json(notificacoes);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getNotificacoes = getNotificacoes;
const getNotificacaoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificacao = yield NotificacaoService_1.NotificacaoService.getById(Number(req.params.id));
        res.status(200).json(notificacao);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.getNotificacaoById = getNotificacaoById;
const updateNotificacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificacao = yield NotificacaoService_1.NotificacaoService.update(Number(req.params.id), req.body);
        res.status(200).json(notificacao);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateNotificacao = updateNotificacao;
const deleteNotificacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield NotificacaoService_1.NotificacaoService.delete(Number(req.params.id));
        res.status(200).json({ message: 'Notificação excluída com sucesso.' });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.deleteNotificacao = deleteNotificacao;
