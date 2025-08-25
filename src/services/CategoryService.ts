import { Category } from '../models/Category'

export class CategoryService {
  static async create(name: string, type: 'DESPESA' | 'RECEITA' | 'META' | 'TRANSACAO_RECORRENTE') {
    if (!name) throw new Error('Nome da categoria é obrigatório.')
    if (!type) throw new Error('Tipo da categoria é obrigatório.')

    return await Category.create({ name, type })
  }

  static async findAll() {
    return await Category.findAll()
  }

  static async findById(id: string) {
    return await Category.findByPk(id)
  }

  static async update(
    id: string,
    name: string,
    type?: 'DESPESA' | 'RECEITA' | 'META' | 'TRANSACAO_RECORRENTE'
  ) {
    if (!name) throw new Error('Nome da categoria é obrigatório para atualização.')

    const category = await Category.findByPk(id)
    if (!category) throw new Error('Categoria não encontrada.')

    // Solo actualizamos type si se pasa
    await category.update({ name, ...(type && { type }) })
    return category
  }

  static async delete(id: string) {
    const category = await Category.findByPk(id)
    if (!category) throw new Error('Categoria não encontrada.')

    await category.destroy()
  }
}
