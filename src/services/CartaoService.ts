import { Cartao } from '../models/Cartao'
import { Usuario } from '../models/Usuario'
import { Conta } from '../models/Conta'

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Conta, as: 'conta', attributes: ['id', 'bancoNome', 'agencia', 'conta'] },
]

export class CartaoService {
  static async create(data: {
    userId: string
    contaId: string
    nome: string
    type: 'CREDITO' | 'DEBITO' | 'MISTO'
    creditLimit?: number
    hasCashback?: boolean
    cashbackPercent?: number
    closingDay: number
    dueDay: number
    active?: boolean
  }) {
    const {
      userId,
      contaId,
      nome,
      type,
      creditLimit = 0,
      hasCashback = false,
      cashbackPercent = 0,
      closingDay,
      dueDay,
      active = true,
    } = data

  if (!userId || !contaId || !nome || !type || closingDay === undefined || dueDay === undefined) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

  // Validações adicionais
  if (creditLimit < 0) throw new Error('Limite de crédito não pode ser negativo.')
  if (cashbackPercent < 0 || cashbackPercent > 100) throw new Error('Cashback deve estar entre 0 e 100%.')
  if (closingDay < 1 || closingDay > 28) throw new Error('Dia de fechamento deve estar entre 1 e 28.')
  if (dueDay < 1 || dueDay > 28) throw new Error('Dia de vencimento deve estar entre 1 e 28.')
  if (dueDay === closingDay) throw new Error('Dia de vencimento não pode ser igual ao dia de fechamento.')

  const user = await Usuario.findByPk(userId)
  if (!user) throw new Error('Usuário não encontrado.')
  const conta = await Conta.findByPk(contaId)
  if (!conta) throw new Error('Conta não encontrada.')

  const novoCartao = await Cartao.create({
      userId,
      contaId,
      nome,
      type,
      creditLimit,
  creditUsed: 0,
      hasCashback,
      cashbackPercent,
      closingDay,
      dueDay,
      active,
    })

    return await Cartao.findByPk(novoCartao.id, { include: includeRelations })
  }

  static async findAll() {
    return await Cartao.findAll({ include: includeRelations })
  }

  static async findAllByUser(userId: string) {
    return await Cartao.findAll({ where: { userId }, include: includeRelations })
  }

  static async findById(id: string) {
    return await Cartao.findByPk(id, { include: includeRelations })
  }

  static async resumo(id: string) {
    const cartao = await Cartao.findByPk(id, { include: includeRelations })
    if (!cartao) throw new Error('Cartão não encontrado.')
    const creditLimitNum = Number(cartao.creditLimit)
    const creditUsedNum = Number(cartao.creditUsed)
    const available = Math.max(0, creditLimitNum - creditUsedNum)
    const percentUsed = creditLimitNum > 0 ? +(creditUsedNum / creditLimitNum * 100).toFixed(2) : 0
    return {
      id: cartao.id,
      nome: cartao.nome,
      type: cartao.type,
      creditLimit: creditLimitNum,
      creditUsed: creditUsedNum,
      available,
      percentUsed,
      conta: (cartao as any).conta,
    }
  }

  static async update(id: string, data: Partial<{
    nome: string
    type: 'CREDITO' | 'DEBITO' | 'MISTO'
    creditLimit: number
    hasCashback: boolean
    cashbackPercent: number
    closingDay: number
    dueDay: number
    active: boolean
  }>) {
    const cartao = await Cartao.findByPk(id)
    if (!cartao) throw new Error('Cartão não encontrado.')

    if (data.creditLimit !== undefined && data.creditLimit < 0) throw new Error('Limite de crédito não pode ser negativo.')
    if (data.cashbackPercent !== undefined && (data.cashbackPercent < 0 || data.cashbackPercent > 100)) throw new Error('Cashback deve estar entre 0 e 100%.')
    if (data.closingDay !== undefined && (data.closingDay < 1 || data.closingDay > 28)) throw new Error('Dia de fechamento inválido.')
    if (data.dueDay !== undefined && (data.dueDay < 1 || data.dueDay > 28)) throw new Error('Dia de vencimento inválido.')
    if (data.dueDay !== undefined && data.closingDay !== undefined && data.dueDay === data.closingDay) {
      throw new Error('Dia de vencimento não pode ser igual ao dia de fechamento.')
    }

    await cartao.update(data)
    return await Cartao.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const cartao = await Cartao.findByPk(id);
    if (!cartao) throw new Error('Cartão não encontrado.');
  
    await cartao.destroy(); // deleta o registro do banco
  
    return true;
  }
}
