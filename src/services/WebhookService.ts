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
      // consulta detalhes do pagamento no MP
      const payment: any = await mercadoPago.payment.get({ id: paymentId })
      if (!payment) return null

      const { status, transaction_amount, description, payer, transaction_details } = payment
      const valor = Number(transaction_amount)
      if (valor <= 0) return null

      const descricao = description || `Pagamento MP ${paymentId}`
      const emailPagador = payer?.email || 'desconhecido'

      // Mapeamento de status
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

      // Evitar duplicidade: checar se já existe receita/despesa com este paymentId
      const eventoExistente = await EventoWebhook.findOne({ where: { mercado_pago_event_id: paymentId, verificado: true } })
      if (eventoExistente) return statusTraduzido

      // Lógica de criação de receita/despesa
      // Aqui assumimos que pagamento recebido é receita, pagamento realizado é despesa
      if (statusTraduzido === 'APROVADO') {
        // Criar receita
        await ReceitaService.create({
          userId: 'USER_ID_FIXO_OU_MAPEADO',
          accountId: 'CONTA_PADRAO',
          categoryId: 'CATEGORIA_RECEITAS',
          description: descricao,
          quantidade: valor,
          data: new Date(),
          nota: `Recebido via Mercado Pago (${emailPagador})`,
        })

        // Criar despesa somente se houver referencia de pagamento (ex: PIX ou débito automático)
        if (transaction_details?.payment_method_reference_id) {
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
      }

      // Estorno/reembolso
      if (statusTraduzido === 'REEMBOLSADO') {
        await ReceitaService.deleteByPaymentId(paymentId)
        await DespesaService.deleteByPaymentId(paymentId)
      }

      // Marcar evento como processado
      await EventoWebhook.update({ verificado: true }, { where: { mercado_pago_event_id: paymentId } })

      return statusTraduzido

    } catch (error) {
      console.error(`Erro ao processar pagamento ${paymentId}`, error)
      return null
    }
  }

}
