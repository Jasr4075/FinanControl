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

    const novoCartao = await Cartao.create({
      userId,
      contaId,
      nome,
      type,
      creditLimit,
      hasCashback,
      cashbackPercent,
      closingDay,
      dueDay,
      active,
    })

    return await Cartao.findByPk(novoCartao.id, { include: includeRelations })
  }

  // Retorna todos os cartões com relações
  static async findAll() {
    return await Cartao.findAll({ include: includeRelations })
  }

  // Busca cartão por ID com relações
  static async findById(id: string) {
    return await Cartao.findByPk(id, { include: includeRelations })
  }

  // Atualiza cartão por ID e retorna atualizado com relações
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

    await cartao.update(data)
    return await Cartao.findByPk(id, { include: includeRelations })
  }

  // Remove cartão por ID
  static async delete(id: string) {
    const cartao = await Cartao.findByPk(id)
    if (!cartao) throw new Error('Cartão não encontrado.')
    await cartao.destroy()
  }
}
