import { Parcela } from '../models/Parcela'
import { Despesa } from '../models/Despesa'
import { Cartao } from '../models/Cartao'
import { Fatura } from '../models/Fatura'

const includeRelations = [
  { model: Despesa, as: 'despesa', attributes: ['id', 'descricao', 'valor'] },
  { model: Cartao, as: 'cartao', attributes: ['id', 'nome', 'type'] },
  { model: Fatura, as: 'fatura', attributes: ['id', 'mes', 'ano', 'valorTotal', 'paga'] },
]

export class ParcelaService {
  static async create(data: {
    despesaId: string
    cartaoId: string
    numeroParcela: number
    valor: number
    dataVencimento: Date
    faturaId?: string | null
    paga?: boolean
    dataPagamento?: Date | null
  }) {
    const { despesaId, cartaoId, numeroParcela, valor, dataVencimento } = data
    if (!despesaId || !cartaoId || !numeroParcela || !valor || !dataVencimento) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    const novaParcela = await Parcela.create({
      ...data,
      faturaId: data.faturaId ?? null,
      paga: data.paga ?? false,
      dataPagamento: data.dataPagamento ?? null,
    })

    return await Parcela.findByPk(novaParcela.id, { include: includeRelations })
  }

  static async findAll() {
    return await Parcela.findAll({ include: includeRelations })
  }

  static async findById(id: string) {
    return await Parcela.findByPk(id, { include: includeRelations })
  }

  static async update(id: string, data: Partial<{
    despesaId: string
    cartaoId: string
    numeroParcela: number
    valor: number
    dataVencimento: Date
    faturaId?: string | null
    paga?: boolean
    dataPagamento?: Date | null
  }>) {
    const parcela = await Parcela.findByPk(id)
    if (!parcela) throw new Error('Parcela não encontrada.')

    await parcela.update(data)
    return await Parcela.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const parcela = await Parcela.findByPk(id)
    if (!parcela) throw new Error('Parcela não encontrada.')
    await parcela.destroy()
  }
}
