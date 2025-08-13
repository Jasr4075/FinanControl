import { Conta } from '../models/Conta'
import { Usuario } from '../models/Usuario'

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
]

export class ContaService {
  static async create(data: {
    userId: string
    type: 'CORRENTE' | 'POUPANCA' | 'EFETIVO'
    bancoNome: string
    agencia: string
    conta: string
    saldo?: number
    efetivo?: boolean
    cdiPercent?: number
  }) {
    const { userId, type, bancoNome, agencia, conta, saldo = 0, efetivo = false, cdiPercent = 0 } = data

    if (!userId || !type || !bancoNome || !agencia || !conta) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    const novaConta = await Conta.create({
      userId,
      type,
      bancoNome,
      agencia,
      conta,
      saldo,
      efetivo,
      cdiPercent,
    })

    return await Conta.findByPk(novaConta.id, { include: includeRelations })
  }

  static async findAll() {
    return await Conta.findAll({ include: includeRelations })
  }

  static async findById(id: string) {
    return await Conta.findByPk(id, { include: includeRelations })
  }

  static async update(id: string, data: Partial<{
    type: 'CORRENTE' | 'POUPANCA' | 'EFETIVO'
    bancoNome: string
    agencia: string
    conta: string
    saldo: number
    efetivo: boolean
    cdiPercent: number
  }>) {
    const conta = await Conta.findByPk(id)
    if (!conta) throw new Error('Conta não encontrada.')

    await conta.update(data)

    return await Conta.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const conta = await Conta.findByPk(id)
    if (!conta) throw new Error('Conta não encontrada.')
    await conta.destroy()
  }
}
