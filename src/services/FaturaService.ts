import { Fatura } from '../models/Fatura'
import { Parcela } from '../models/Parcela'
import { Conta } from '../models/Conta'
import { Cartao } from '../models/Cartao'
import { Despesa } from '../models/Despesa'
import { sequelize } from '../config/config'

const includeRelations = [
  { model: Fatura.sequelize!.models.Cartao, as: 'cartao', attributes: ['id', 'nome', 'type'] },
]

export class FaturaService {
  /**
   * Encontra uma fatura pelo cartão + mês + ano ou cria uma nova se não existir.
   * Não marca como paga e inicia valorTotal em 0.
   */
  static async findOrCreate(cartaoId: string, mes: number, ano: number) {
    if (!cartaoId || !mes || !ano) throw new Error('Parâmetros insuficientes para localizar/criar fatura.')
    if (mes < 1 || mes > 12) throw new Error('Mês inválido. Deve estar entre 1 e 12.')

    let fatura = await Fatura.findOne({ where: { cartaoId, mes, ano } })
    if (!fatura) {
      fatura = await Fatura.create({
        cartaoId,
        mes,
        ano,
        valorTotal: 0,
        valorPago: 0,
        paga: true, // fatura vazia é considerada paga
        dataPagamento: null,
      })
    }
    return fatura
  }

  /**
   * Recalcula o valorTotal de uma fatura somando as parcelas associadas.
   */
  static async recomputeValorTotal(faturaId: string) {
    const fatura = await Fatura.findByPk(faturaId)
    if (!fatura) throw new Error('Fatura não encontrada.')
    const total = await Parcela.sum('valor', { where: { faturaId } })
    fatura.valorTotal = Number(total || 0) as any
    if (Number(fatura.valorTotal) === 0) {
      fatura.paga = true
      fatura.dataPagamento = fatura.dataPagamento ?? new Date()
    }
    if (Number(fatura.valorPago) >= Number(fatura.valorTotal)) {
      fatura.paga = true
      fatura.dataPagamento = fatura.dataPagamento ?? new Date()
    } else if (Number(fatura.valorPago) > 0) {
      fatura.paga = false
    }
    await fatura.save()
    return fatura
  }

  /**
   * Paga a fatura debitando o valorTotal da conta informada.
   * Mantém fatura aberta para novas despesas se for antes do fechamento? Regra: pagamento antecipado não impede novas parcelas futuras; logo apenas marca paga se não houver saldo futuro.
   * Implementação mínima: marcar paga sempre que valorTotal > 0 e débito concluído.
   */
  static async pagar(id: string, contaId: string) {
    return await sequelize.transaction(async (t) => {
      const fatura = await Fatura.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE })
      if (!fatura) throw new Error('Fatura não encontrada.')
      if (Number(fatura.valorTotal) === 0) {
        fatura.paga = true
        fatura.dataPagamento = fatura.dataPagamento ?? new Date()
        return fatura
      }
      if (Number(fatura.valorPago) >= Number(fatura.valorTotal)) return fatura
      const conta = await Conta.findByPk(contaId, { transaction: t, lock: t.LOCK.UPDATE })
      if (!conta) throw new Error('Conta não encontrada.')
      const restante = Number(fatura.valorTotal) - Number(fatura.valorPago)
      if (restante <= 0) return fatura
      if (restante > Number(conta.saldo)) throw new Error('Saldo insuficiente para pagamento da fatura.')
      conta.saldo = Number(conta.saldo) - restante
      await conta.save({ transaction: t })
      fatura.valorPago = Number(fatura.valorPago) + restante as any
      if (Number(fatura.valorPago) >= Number(fatura.valorTotal)) {
        fatura.paga = true
        fatura.dataPagamento = fatura.dataPagamento ?? new Date()
        // Ajustar creditUsed do cartão ao quitar totalmente
        const cartao = await Cartao.findByPk(fatura.cartaoId, { transaction: t, lock: t.LOCK.UPDATE })
        if (cartao) {
          const novoUsed = Number(cartao.creditUsed) - Number(fatura.valorTotal)
          cartao.creditUsed = (novoUsed < 0 ? 0 : novoUsed) as any
          await cartao.save({ transaction: t })
        }
      }
      await fatura.save({ transaction: t })
      return fatura
    })
  }

  /**
   * Aplica delta simples no valorTotal (uso interno opcional).
   */
  static async aplicarDelta(faturaId: string, delta: number) {
    const fatura = await Fatura.findByPk(faturaId)
    if (!fatura) throw new Error('Fatura não encontrada.')
    fatura.valorTotal = Number(fatura.valorTotal || 0) + delta as any
    if (fatura.valorTotal < 0) fatura.valorTotal = 0 as any
    if (Number(fatura.valorTotal) === 0) {
      fatura.paga = true
      fatura.dataPagamento = fatura.dataPagamento ?? new Date()
      fatura.valorPago = fatura.valorTotal
    } else if (Number(fatura.valorPago) >= Number(fatura.valorTotal)) {
      fatura.paga = true
      fatura.dataPagamento = fatura.dataPagamento ?? new Date()
    } else {
      fatura.paga = false
    }
    await fatura.save()
    return fatura
  }
  static async create(data: {
    cartaoId: string
    mes: number
    ano: number
    valorTotal?: number
    paga?: boolean
    dataPagamento?: Date | null
  }) {
    const { cartaoId, mes, ano, valorTotal = 0, paga = false, dataPagamento = null } = data

    if (!cartaoId || !mes || !ano) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    if (mes < 1 || mes > 12) {
      throw new Error('Mês inválido. Deve estar entre 1 e 12.')
    }

    const novaFatura = await Fatura.create({
      cartaoId,
      mes,
      ano,
      valorTotal,
      valorPago: valorTotal === 0 ? 0 : 0,
      paga: valorTotal === 0 ? true : paga,
      dataPagamento: valorTotal === 0 ? new Date() : dataPagamento,
    })

    return await Fatura.findByPk(novaFatura.id, { include: includeRelations })
  }

  static async getAll() {
    return await Fatura.findAll({ include: includeRelations })
  }

  static async getById(id: string) {
    const fatura = await Fatura.findByPk(id, { include: includeRelations })
    if (!fatura) {
      throw new Error('Fatura não encontrada.')
    }
    return fatura
  }

  static async update(id: string, data: any) {
    const fatura = await Fatura.findByPk(id)
    if (!fatura) {
      throw new Error('Fatura não encontrada.')
    }

    if (data.mes && (data.mes < 1 || data.mes > 12)) {
      throw new Error('Mês inválido. Deve estar entre 1 e 12.')
    }

    await fatura.update(data)

    return await Fatura.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const fatura = await Fatura.findByPk(id)
    if (!fatura) {
      throw new Error('Fatura não encontrada.')
    }
    await fatura.destroy()
    return { message: 'Fatura excluída com sucesso.' }
  }

  static async detalhe(faturaId: string) {
    const fatura = await Fatura.findByPk(faturaId, {
      include: [
        ...includeRelations,
        {
          model: Parcela,
          as: 'parcelas',
          include: [
            {
              model: Despesa,
              as: 'despesa',
              attributes: ['id', 'descricao', 'valor', 'metodoPagamento', 'data'],
            },
          ],
        },
      ],
      order: [[{ model: Parcela, as: 'parcelas' }, 'numeroParcela', 'ASC']],
    })
    if (!fatura) throw new Error('Fatura não encontrada.')
    const restante = Number(fatura.valorTotal) - Number(fatura.valorPago)
    const percentPago = Number(fatura.valorTotal) > 0 ? +(Number(fatura.valorPago) / Number(fatura.valorTotal) * 100).toFixed(2) : 100
    return { fatura, resumo: { restante, percentPago } }
  }

  static async byCartaoMes(cartaoId: string, mes: number, ano: number, createIfMissing = true) {
    let fatura = await Fatura.findOne({ where: { cartaoId, mes, ano } })
    if (!fatura && createIfMissing) {
      fatura = await this.findOrCreate(cartaoId, mes, ano)
    }
    if (!fatura) throw new Error('Fatura não encontrada.')
    return this.detalhe(fatura.id)
  }

  static async atual(cartaoId: string, referenceDate = new Date()) {
    const mes = referenceDate.getMonth() + 1
    const ano = referenceDate.getFullYear()
    return this.byCartaoMes(cartaoId, mes, ano, true)
  }

  static async listByCartao(cartaoId: string, page = 1, pageSize = 6) {
    if (page < 1) page = 1
    const offset = (page - 1) * pageSize
    const { count, rows } = await Fatura.findAndCountAll({
      where: { cartaoId },
      order: [ ['ano', 'DESC'], ['mes', 'DESC'] ],
      offset,
      limit: pageSize,
    })
    return {
      data: rows,
      page,
      pageSize,
      total: count,
      totalPages: Math.ceil(count / pageSize),
    }
  }
}
