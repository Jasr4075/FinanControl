import { Receita } from '../models/Receita'
import { Usuario } from '../models/Usuario'
import { Conta } from '../models/Conta'
import { Category } from '../models/Category'
import { Op } from 'sequelize';
import { sequelize } from '../config/config'

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Conta, as: 'conta', attributes: ['id', 'bancoNome', 'conta'] },
  { model: Category, as: 'categories', attributes: ['id', 'name'] },
]

export class ReceitaService {
  static async create(data: {
    userId: string
    accountId: string
    categoryId: string
    description: string
    quantidade: number
    data: Date
    nota?: string | null
  }) {
  if (Number(data.quantidade) <= 0) throw new Error('Quantidade deve ser maior que zero.')
    // Cria a receita
    const receita = await Receita.create({
      ...data,
      nota: data.nota ?? undefined,
    })

    // Atualiza o saldo da conta
    const conta = await Conta.findByPk(data.accountId)
    if (!conta) throw new Error('Conta não encontrada.')

    conta.saldo = Number(conta.saldo) + Number(data.quantidade)
    await conta.save()

    return Receita.findByPk(receita.id, { include: includeRelations })
  }

  static async findAll() {
    return Receita.findAll({ include: includeRelations })
  }

  static async list(params: {
    userId: string
    page?: number
    pageSize?: number
    dataInicio?: Date | string
    dataFim?: Date | string
    categoryId?: string
    accountId?: string
  }) {
    const { userId, page = 1, pageSize = 20, dataInicio, dataFim, categoryId, accountId } = params
    const where: any = { userId }
    if (dataInicio && dataFim) where.data = { [Op.between]: [dataInicio, dataFim] }
    else if (dataInicio) where.data = { [Op.gte]: dataInicio }
    else if (dataFim) where.data = { [Op.lte]: dataFim }
    if (categoryId) where.categoryId = categoryId
    if (accountId) where.accountId = accountId
    const offset = (page - 1) * pageSize
    const { rows, count } = await Receita.findAndCountAll({ where, limit: pageSize, offset, order: [['data', 'DESC']], include: includeRelations })
    return { data: rows, total: count, page, pageSize, totalPages: Math.ceil(count / pageSize) }
  }

  static async findById(id: string) {
    return Receita.findByPk(id, { include: includeRelations })
  }

  static async update(id: string, updates: Partial<Receita>) {
    const receita = await Receita.findByPk(id)
    if (!receita) return null
    const conta = await Conta.findByPk((receita as any).accountId)
    // Ajuste de saldo se quantidade alterada
    if (updates.quantidade && Number(updates.quantidade) <= 0) {
      throw new Error('Quantidade deve ser maior que zero.')
    }
    if (updates.quantidade && conta) {
      const delta = Number(updates.quantidade) - Number((receita as any).quantidade)
      conta.saldo = Number(conta.saldo) + delta
      await conta.save()
    }
    await receita.update(updates)
    return Receita.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const receita = await Receita.findByPk(id)
    if (!receita) return null
    const conta = await Conta.findByPk((receita as any).accountId)
    if (conta) {
      conta.saldo = Number(conta.saldo) - Number((receita as any).quantidade)
      await conta.save()
    }
    await receita.destroy()
    return true
  }

  static async getTotalMes(userId: string) {
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const hoje = new Date()

    return await Receita.sum('quantidade', {
      where: {
        userId,
        data: { [Op.between]: [inicioMes, hoje] }
      }
    }) || 0
  }

  static async getTotalByMonth(userId: string, ano: number, mes: number) { // mes 1-12
    const inicio = new Date(ano, mes - 1, 1)
    const fim = new Date(ano, mes, 0, 23, 59, 59, 999)
    return await Receita.sum('quantidade', {
      where: { userId, data: { [Op.between]: [inicio, fim] } }
    }) || 0
  }

  static async getUltimas(userId: string, limit = 10) {
    return await Receita.findAll({
      where: { userId },
      order: [['data', 'DESC']],
      limit,
      include: includeRelations,
    })
  }

  static async deleteByPaymentId(paymentId: string) {
    const receita = await Receita.findOne({ where: { nota: { [Op.iLike]: `%${paymentId}%` } } })
    if (!receita) return null
    const conta = await Conta.findByPk(receita.accountId)
    if (conta) {
      conta.saldo = Number(conta.saldo) - Number(receita.quantidade)
      await conta.save()
    }
    await receita.destroy()
    return true
  }
}
