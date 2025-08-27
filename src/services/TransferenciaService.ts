import { Transferencia } from '../models/Transferencia'
import { Conta } from '../models/Conta'
import { Op } from 'sequelize'
import { sequelize } from '../config/config'

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
    if (data.fromAccountId === data.toAccountId) throw new Error('Contas devem ser diferentes.')
    if (Number(data.amount) <= 0) throw new Error('Valor deve ser maior que zero.')

    return await sequelize.transaction(async (t) => {
      const origem = await Conta.findByPk(data.fromAccountId, { transaction: t, lock: t.LOCK.UPDATE })
      const destino = await Conta.findByPk(data.toAccountId, { transaction: t, lock: t.LOCK.UPDATE })
      if (!origem || !destino) throw new Error('Conta origem ou destino não encontrada.')
      if (Number(origem.saldo) < Number(data.amount)) throw new Error('Saldo insuficiente na conta de origem.')

      origem.saldo = Number(origem.saldo) - Number(data.amount)
      destino.saldo = Number(destino.saldo) + Number(data.amount)
      await origem.save({ transaction: t })
      await destino.save({ transaction: t })

      const novaTransferencia = await Transferencia.create({
        ...data,
        date: data.date ?? new Date(),
      }, { transaction: t })

      return await Transferencia.findByPk(novaTransferencia.id, { include: includeRelations, transaction: t })
    })
  },

  async getAll() {
    return await Transferencia.findAll({ include: includeRelations })
  },

  async list(params: { page?: number; pageSize?: number; dataInicio?: Date | string; dataFim?: Date | string; fromAccountId?: string; toAccountId?: string }) {
    const { page = 1, pageSize = 20, dataInicio, dataFim, fromAccountId, toAccountId } = params
    const where: any = {}
    if (dataInicio && dataFim) where.date = { [Op.between]: [dataInicio, dataFim] }
    else if (dataInicio) where.date = { [Op.gte]: dataInicio }
    else if (dataFim) where.date = { [Op.lte]: dataFim }
    if (fromAccountId) where.fromAccountId = fromAccountId
    if (toAccountId) where.toAccountId = toAccountId
    const offset = (page - 1) * pageSize
    const { rows, count } = await Transferencia.findAndCountAll({ where, limit: pageSize, offset, order: [['date', 'DESC']], include: includeRelations })
    return { data: rows, total: count, page, pageSize, totalPages: Math.ceil(count / pageSize) }
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
    // Atualizar transferência complexamente (ajuste saldos) poderia ser perigoso.
    // Implementação mínima: bloquear mudança de amount ou contas após criação.
    if (data.amount || data.fromAccountId || data.toAccountId) {
      throw new Error('Alteração de contas ou valor não suportada para manter integridade.')
    }
    const transferencia = await Transferencia.findByPk(id)
    if (!transferencia) throw new Error('Transferência não encontrada.')
    await transferencia.update({ date: data.date ?? (transferencia as any).date, description: data.description ?? (transferencia as any).description })
    return await Transferencia.findByPk(id, { include: includeRelations })
  },

  async delete(id: string) {
    const transferencia = await Transferencia.findByPk(id)
    if (!transferencia) throw new Error('Transferência não encontrada.')
    return await sequelize.transaction(async (t) => {
      const origem = await Conta.findByPk((transferencia as any).fromAccountId, { transaction: t, lock: t.LOCK.UPDATE })
      const destino = await Conta.findByPk((transferencia as any).toAccountId, { transaction: t, lock: t.LOCK.UPDATE })
      if (origem && destino) {
        // Reverter saldos
        origem.saldo = Number(origem.saldo) + Number((transferencia as any).amount)
        destino.saldo = Number(destino.saldo) - Number((transferencia as any).amount)
        if (Number(destino.saldo) < 0) throw new Error('Operação inválida: saldo destino ficaria negativo ao reverter.')
        await origem.save({ transaction: t })
        await destino.save({ transaction: t })
      }
      await transferencia.destroy({ transaction: t })
      return { message: 'Transferência excluída com sucesso.' }
    })
  }
}
