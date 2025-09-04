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
            try {
                // consulta detalhes do pagamento no MP
                const payment = yield mercadopago_1.default.payment.get({ id: paymentId });
                if (!payment)
                    return null;
                const { status, transaction_amount, description, payer, transaction_details } = payment;
                const valor = Number(transaction_amount);
                if (valor <= 0)
                    return null;
                const descricao = description || `Pagamento MP ${paymentId}`;
                const emailPagador = (payer === null || payer === void 0 ? void 0 : payer.email) || 'desconhecido';
                // Mapeamento de status
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
                // Evitar duplicidade: checar se já existe receita/despesa com este paymentId
                const eventoExistente = yield EventoWebHook_1.EventoWebhook.findOne({ where: { mercado_pago_event_id: paymentId, verificado: true } });
                if (eventoExistente)
                    return statusTraduzido;
                // Lógica de criação de receita/despesa
                // Aqui assumimos que pagamento recebido é receita, pagamento realizado é despesa
                if (statusTraduzido === 'APROVADO') {
                    // Criar receita
                    yield ReceitaService_1.ReceitaService.create({
                        userId: 'USER_ID_FIXO_OU_MAPEADO',
                        accountId: 'CONTA_PADRAO',
                        categoryId: 'CATEGORIA_RECEITAS',
                        description: descricao,
                        quantidade: valor,
                        data: new Date(),
                        nota: `Recebido via Mercado Pago (${emailPagador})`,
                    });
                    // Criar despesa somente se houver referencia de pagamento (ex: PIX ou débito automático)
                    if (transaction_details === null || transaction_details === void 0 ? void 0 : transaction_details.payment_method_reference_id) {
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
                }
                // Estorno/reembolso
                if (statusTraduzido === 'REEMBOLSADO') {
                    yield ReceitaService_1.ReceitaService.deleteByPaymentId(paymentId);
                    yield DespesaService_1.DespesaService.deleteByPaymentId(paymentId);
                }
                // Marcar evento como processado
                yield EventoWebHook_1.EventoWebhook.update({ verificado: true }, { where: { mercado_pago_event_id: paymentId } });
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
