import { TransacoesRecorrentes } from '../models/TransacoesRecorrentes'
import { Usuario } from '../models/Usuario'
import { Category } from '../models/Category'

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Category, as: 'categoria', attributes: ['id', 'name'] },
]

export class TransacoesRecorrentesService {
  static async create(data: {
    userId: string
    type: 'Despesa' | 'Receita'
    amount: number
    descricao: string
    frequencia: 'diario' | 'semanal' | 'mensal'
    dataInicio: Date
    dataFinal?: Date | null
    categoryId: string
    active?: boolean
  }) {
    const {
      userId,
      type,
      amount,
      descricao,
      frequencia,
      dataInicio,
      dataFinal,
      active,
      categoryId
    } = data

    if (!userId || !type || !amount || !descricao || !frequencia || !dataInicio || !categoryId) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    if (!['Despesa', 'Receita'].includes(type)) {
      throw new Error('Tipo inválido, use "Despesa" ou "Receita"')
    }

    if (!['diario', 'semanal', 'mensal'].includes(frequencia)) {
      throw new Error('Frequência inválida, use "diario", "semanal" ou "mensal"')
    }

    const novaTransacao = await TransacoesRecorrentes.create({
      dataFinal: dataFinal ?? null,
      active: active ?? true,
      userId,
      type,
      amount,
      descricao,
      frequencia,
      dataInicio,
      categoryId
    })

    return await TransacoesRecorrentes.findByPk(novaTransacao.id, { include: includeRelations })
  }

  static async getAll() {
    return await TransacoesRecorrentes.findAll({ include: includeRelations })
  }

  static async getById(id: string) {
    const transacao = await TransacoesRecorrentes.findByPk(id, { include: includeRelations })
    if (!transacao) {
      throw new Error('Transação recorrente não encontrada.')
    }
    return transacao
  }

  static async update(id: string, data: Partial<TransacoesRecorrentes>) {
    const transacao = await TransacoesRecorrentes.findByPk(id)
    if (!transacao) {
      throw new Error('Transação recorrente não encontrada.')
    }

    await transacao.update(data)
    return await TransacoesRecorrentes.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const transacao = await TransacoesRecorrentes.findByPk(id)
    if (!transacao) {
      throw new Error('Transação recorrente não encontrada.')
    }

    await transacao.destroy()
    return { message: 'Transação recorrente excluída com sucesso.' }
  }
}
