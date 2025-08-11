import { Receita } from '../models/Receita'
import { Usuario } from '../models/Usuario'
import { Conta } from '../models/Conta'
import { Category } from '../models/Category'

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Conta, as: 'contas', attributes: ['id', 'bancoNome', 'conta'] },
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
    const receita = await Receita.create({
      ...data,
      nota: data.nota ?? undefined,
    })

    return Receita.findByPk(receita.id, { include: includeRelations })
  }

  static async findAll() {
    return Receita.findAll({ include: includeRelations })
  }

  static async findById(id: string) {
    return Receita.findByPk(id, { include: includeRelations })
  }

  static async update(id: string, updates: Partial<Receita>) {
    const receita = await Receita.findByPk(id)
    if (!receita) return null

    await receita.update(updates)
    return Receita.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const receita = await Receita.findByPk(id)
    if (!receita) return null

    await receita.destroy()
    return true
  }
}
