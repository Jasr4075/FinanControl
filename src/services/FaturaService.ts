import { Fatura } from '../models/Fatura'

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
        paga: false,
        dataPagamento: null,
      })
    }
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
      paga,
      dataPagamento,
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
}
