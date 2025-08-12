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
exports.NotificacaoService = void 0;
const Notificacao_1 = require("../models/Notificacao");
class NotificacaoService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, type, message, read = false } = data;
            if (!userId || !type || !message) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            const novaNotificacao = yield Notificacao_1.Notificacao.create({
                userId,
                type,
                message,
                read,
            });
            return novaNotificacao;
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Notificacao_1.Notificacao.findAll();
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificacao = yield Notificacao_1.Notificacao.findByPk(id);
            if (!notificacao) {
                throw new Error('Notificação não encontrada.');
            }
            return notificacao;
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificacao = yield Notificacao_1.Notificacao.findByPk(id);
            if (!notificacao) {
                throw new Error('Notificação não encontrada.');
            }
            yield notificacao.update(data);
            return notificacao;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificacao = yield Notificacao_1.Notificacao.findByPk(id);
            if (!notificacao) {
                throw new Error('Notificação não encontrada.');
            }
            yield notificacao.destroy();
        });
    }
}
exports.NotificacaoService = NotificacaoService;
