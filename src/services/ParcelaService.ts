import { Parcela } from '../models/Parcela'
import { Despesa } from '../models/Despesa'
import { Cartao } from '../models/Cartao'
import { Fatura } from '../models/Fatura'
import { FaturaService } from './FaturaService'

const includeRelations = [
  { model: Despesa, as: 'despesa', attributes: ['id', 'descricao', 'valor'] },
  { model: Cartao, as: 'cartao', attributes: ['id', 'nome', 'type'] },
  { model: Fatura, as: 'fatura', attributes: ['id', 'mes', 'ano', 'valorTotal', 'paga'] },
]

export class ParcelaService {
  static async create(data: {
    despesaId: string
    cartaoId: string | null
    numeroParcela: number
    valor: number
    dataVencimento: Date
    faturaId?: string | null
    paga?: boolean
    dataPagamento?: Date | null
  }) {
    const { despesaId, cartaoId, numeroParcela, valor, dataVencimento } = data
    if (!despesaId || !numeroParcela || !valor || !dataVencimento) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    // Se houver cartaoId devemos garantir a existência da fatura correspondente ao mês/ano da data de vencimento
    let faturaId = data.faturaId || null
    if (cartaoId) {
      const mes = dataVencimento.getMonth() + 1 // JS month is 0-based
      const ano = dataVencimento.getFullYear()
      const fatura = await FaturaService.findOrCreate(cartaoId, mes, ano)
      faturaId = fatura.id
    }

    const createPayload: any = {
      despesaId,
      numeroParcela,
      valor,
      dataVencimento,
      faturaId,
      paga: data.paga ?? false,
      dataPagamento: data.dataPagamento ?? null,
    }
    if (cartaoId) createPayload.cartaoId = cartaoId

    // Verifica duplicidade de numeroParcela na mesma despesa
    const existente = await Parcela.findOne({ where: { despesaId, numeroParcela } })
    if (existente) {
      throw new Error('Número de parcela já existe para esta despesa.')
    }

    const novaParcela = await Parcela.create(createPayload)

    // Atualiza o valorTotal da fatura após criar a parcela
    if (faturaId) {
      const fatura = await Fatura.findByPk(faturaId)
      if (fatura) {
        fatura.valorTotal = Number(fatura.valorTotal || 0) + Number(valor)
        await fatura.save()
      }
    }

    return await Parcela.findByPk(novaParcela.id, { include: includeRelations })
  }

  static async findAll() {
    return await Parcela.findAll({ include: includeRelations })
  }

  static async findById(id: string) {
    return await Parcela.findByPk(id, { include: includeRelations })
  }
  static async update(id: string, data: Partial<{ numeroParcela: number; valor: number; dataVencimento: Date; paga: boolean; dataPagamento: Date | null }>) {
    const parcela = await Parcela.findByPk(id)
    if (!parcela) throw new Error('Parcela não encontrada.')
    const valorAntigo = Number(parcela.valor)
    const faturaAntiga = parcela.faturaId

    // Se alterar numeroParcela verificar duplicidade
    if (data.numeroParcela && data.numeroParcela !== parcela.numeroParcela) {
      const dup = await Parcela.findOne({ where: { despesaId: parcela.despesaId, numeroParcela: data.numeroParcela } })
      if (dup) throw new Error('Número de parcela já existe para esta despesa.')
    }

    await parcela.update(data)

    // Ajustes de fatura/valorTotal
    if (parcela.faturaId) {
      const delta = Number(parcela.valor) - valorAntigo
      if (delta !== 0) {
        await FaturaService.aplicarDelta(parcela.faturaId, delta)
      }
    }
    if (faturaAntiga && faturaAntiga !== parcela.faturaId) {
      // remove valor antigo da fatura anterior
      await FaturaService.aplicarDelta(faturaAntiga, -valorAntigo)
    }

    return await Parcela.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const parcela = await Parcela.findByPk(id)
    if (!parcela) throw new Error('Parcela não encontrada.')
    const faturaId = parcela.faturaId
    const valor = Number(parcela.valor)
    await parcela.destroy()
    if (faturaId) {
      await FaturaService.aplicarDelta(faturaId, -valor)
    }
    return true
  }
}
