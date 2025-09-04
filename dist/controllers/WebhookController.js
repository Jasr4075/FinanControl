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
exports.WebhookController = void 0;
const WebhookService_1 = require("../services/WebhookService");
const EventoWebHook_1 = require("../models/EventoWebHook");
class WebhookController {
    static registrar(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { type, id, data } = req.body;
                if (!type || !(data === null || data === void 0 ? void 0 : data.id)) {
                    res.status(400).json({ erro: 'Dados do webhook inválidos.' });
                    return;
                }
                const mercadoPagoEventId = ((_a = id === null || id === void 0 ? void 0 : id.toString) === null || _a === void 0 ? void 0 : _a.call(id)) || '';
                const resourceId = (_c = (_b = data.id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b);
                const tipoEvento = req.body.action || type;
                yield WebhookService_1.WebhookService.registrarEvento(req.body, tipoEvento, mercadoPagoEventId);
                if ((tipoEvento === null || tipoEvento === void 0 ? void 0 : tipoEvento.startsWith('payment')) && resourceId) {
                    yield WebhookService_1.WebhookService.processarStatus(resourceId);
                }
                res.status(201).json({ mensagem: 'Evento registrado com sucesso.' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static listar(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventos = yield EventoWebHook_1.EventoWebhook.findAll({ order: [['recebido_em', 'DESC']] });
                res.json(eventos);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static buscarPorId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const evento = yield EventoWebHook_1.EventoWebhook.findByPk(req.params.id);
                if (!evento)
                    return res.status(404).json({ erro: 'Evento não encontrado.' });
                res.json(evento);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.WebhookController = WebhookController;
