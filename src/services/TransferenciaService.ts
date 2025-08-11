import { Transferencia } from '../models/Transferencia'
import { Conta } from '../models/Conta'

const includeRelations = [
  { model: Conta, as: 'contaOrigem', attributes: ['id', 'bancoNome', 'agencia', 'conta'] },
  { model: Conta, as: 'contaDestino', attributes: ['id', 'bancoNome', 'agencia', 'conta'] },
]

export const transferenciaService = {
  async create(data: {
    fromAccountId: string
    toAccountId: string
    amount: number
    date?: Date
    description?: string
  }) {
    if (!data.fromAccountId || !data.toAccountId || !data.amount) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    const novaTransferencia = await Transferencia.create({
      ...data,
      date: data.date ?? new Date(),
    })

    return await Transferencia.findByPk(novaTransferencia.id, { include: includeRelations })
  },

  async getAll() {
    return await Transferencia.findAll({ include: includeRelations })
  },

  async getById(id: string) {
    const transferencia = await Transferencia.findByPk(id, { include: includeRelations })
    if (!transferencia) throw new Error('Transferência não encontrada.')
    return transferencia
  },

  async update(id: string, data: Partial<{
    fromAccountId: string
    toAccountId: string
    amount: number
    date: Date
    description: string
  }>) {
    const transferencia = await Transferencia.findByPk(id)
    if (!transferencia) throw new Error('Transferência não encontrada.')

    await transferencia.update(data)

    return await Transferencia.findByPk(id, { include: includeRelations })
  },

  async delete(id: string) {
    const transferencia = await Transferencia.findByPk(id)
    if (!transferencia) throw new Error('Transferência não encontrada.')

    await transferencia.destroy()
    return { message: 'Transferência excluída com sucesso.' }
  }
}
