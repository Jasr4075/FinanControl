import { EventoWebhook } from '../models/EventoWebHook'
import mercadoPago from '../utils/mercadopago'
import { v4 as uuidv4 } from 'uuid'
import { ReceitaService } from './ReceitaService'
import { DespesaService } from './DespesaService'

export class WebhookService {
    static async registrarEvento(payload: any, tipo_evento: string, mp_event_id: string) {
        const existe = await EventoWebhook.findOne({ where: { mercado_pago_event_id: mp_event_id } })
        if (existe) return

        await EventoWebhook.create({
            id: uuidv4(),
            tipo_evento,
            mercado_pago_event_id: mp_event_id,
            payload: JSON.stringify(payload),
            recebido_em: new Date(),
            verificado: false,
        })
    }

    static async processarStatus(paymentId: string) {
        try {
            const payment: any = await mercadoPago.payment.get({ id: paymentId }) // use 'any' ou tipagem correta

            if (!payment) return null
            const status = payment.status
            const valor = payment.transaction_amount
            const descricao = payment.description || `Pagamento MP ${paymentId}`
            const emailPagador = payment.payer?.email || 'desconhecido'

            const statusMap: Record<string, string> = {
                pending: 'PENDENTE',
                in_process: 'PENDENTE',
                in_mediation: 'PENDENTE',
                approved: 'APROVADO',
                rejected: 'RECUSADO',
                cancelled: 'CANCELADO',
                refunded: 'REEMBOLSADO',
                charged_back: 'REEMBOLSADO',
            }

            const statusTraduzido = statusMap[status]
            if (!statusTraduzido) return null

            if (statusTraduzido === 'APROVADO') {
                await ReceitaService.create({
                    userId: 'USER_ID_FIXO_OU_MAPEADO',
                    accountId: 'CONTA_PADRAO',
                    categoryId: 'CATEGORIA_RECEITAS',
                    description: descricao,
                    quantidade: valor,
                    data: new Date(),
                    nota: `Recebido via Mercado Pago (${emailPagador})`,
                })
            }

            if (statusTraduzido === 'APROVADO' && payment.transaction_details?.payment_method_reference_id) {
                await DespesaService.create({
                    userId: 'USER_ID_FIXO_OU_MAPEADO',
                    contaId: 'CONTA_PADRAO',
                    categoryId: 'CATEGORIA_DESPESAS',
                    descricao,
                    valor,
                    metodoPagamento: 'PIX',
                    data: new Date(),
                })
            }

            return statusTraduzido
        } catch (error) {
            console.error(`Erro ao processar pagamento ${paymentId}`, error)
            return null
        }
    }

}
