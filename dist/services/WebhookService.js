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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const EventoWebHook_1 = require("../models/EventoWebHook");
const mercadopago_1 = __importDefault(require("../utils/mercadopago"));
const uuid_1 = require("uuid");
const ReceitaService_1 = require("./ReceitaService");
const DespesaService_1 = require("./DespesaService");
class WebhookService {
    static registrarEvento(payload, tipo_evento, mp_event_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield EventoWebHook_1.EventoWebhook.findOne({ where: { mercado_pago_event_id: mp_event_id } });
            if (existe)
                return;
            yield EventoWebHook_1.EventoWebhook.create({
                id: (0, uuid_1.v4)(),
                tipo_evento,
                mercado_pago_event_id: mp_event_id,
                payload: JSON.stringify(payload),
                recebido_em: new Date(),
                verificado: false,
            });
        });
    }
    static processarStatus(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const payment = yield mercadopago_1.default.payment.get({ id: paymentId }); // use 'any' ou tipagem correta
                if (!payment)
                    return null;
                const status = payment.status;
                const valor = payment.transaction_amount;
                const descricao = payment.description || `Pagamento MP ${paymentId}`;
                const emailPagador = ((_a = payment.payer) === null || _a === void 0 ? void 0 : _a.email) || 'desconhecido';
                const statusMap = {
                    pending: 'PENDENTE',
                    in_process: 'PENDENTE',
                    in_mediation: 'PENDENTE',
                    approved: 'APROVADO',
                    rejected: 'RECUSADO',
                    cancelled: 'CANCELADO',
                    refunded: 'REEMBOLSADO',
                    charged_back: 'REEMBOLSADO',
                };
                const statusTraduzido = statusMap[status];
                if (!statusTraduzido)
                    return null;
                if (statusTraduzido === 'APROVADO') {
                    yield ReceitaService_1.ReceitaService.create({
                        userId: 'USER_ID_FIXO_OU_MAPEADO',
                        accountId: 'CONTA_PADRAO',
                        categoryId: 'CATEGORIA_RECEITAS',
                        description: descricao,
                        quantidade: valor,
                        data: new Date(),
                        nota: `Recebido via Mercado Pago (${emailPagador})`,
                    });
                }
                if (statusTraduzido === 'APROVADO' && ((_b = payment.transaction_details) === null || _b === void 0 ? void 0 : _b.payment_method_reference_id)) {
                    yield DespesaService_1.DespesaService.create({
                        userId: 'USER_ID_FIXO_OU_MAPEADO',
                        contaId: 'CONTA_PADRAO',
                        categoryId: 'CATEGORIA_DESPESAS',
                        descricao,
                        valor,
                        metodoPagamento: 'PIX',
                        data: new Date(),
                    });
                }
                return statusTraduzido;
            }
            catch (error) {
                console.error(`Erro ao processar pagamento ${paymentId}`, error);
                return null;
            }
        });
    }
}
exports.WebhookService = WebhookService;
