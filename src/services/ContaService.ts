import { Conta } from '../models/Conta'
import { Usuario } from '../models/Usuario'

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
]

export class ContaService {
  // Cria uma nova conta validando campos obrigatórios e usando defaults
  static async create(data: {
    userId: string
    type: 'Corrente' | 'Poupança' | 'Efetivo'
    bancoNome: string
    agencia: string
    conta: string
    saldo?: number
    efetivo?: boolean
    cdiPercent?: number
  }) {
    const { userId, type, bancoNome, agencia, conta, saldo = 0, efetivo = false, cdiPercent = 0 } = data

    // Validação simples, poderia ser expandida
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

    // Retorna conta com dados do usuário relacionado
    return await Conta.findByPk(novaConta.id, { include: includeRelations })
  }

  // Retorna todas as contas com os usuários relacionados
  static async findAll() {
    return await Conta.findAll({ include: includeRelations })
  }

  // Busca conta por ID com usuário relacionado
  static async findById(id: string) {
    return await Conta.findByPk(id, { include: includeRelations })
  }

  // Atualiza conta por ID, retornando conta atualizada com usuário
  static async update(id: string, data: Partial<{
    type: 'Corrente' | 'Poupança' | 'Efetivo'
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

  // Exclui conta por ID
  static async delete(id: string) {
    const conta = await Conta.findByPk(id)
    if (!conta) throw new Error('Conta não encontrada.')
    await conta.destroy()
  }
}
