import { Category } from '../models/Category'

export class CategoryService {
static async createBulk(categories: { name: string; type: 'DESPESA' | 'RECEITA' | 'META' | 'TRANSACAO_RECORRENTE' }[]) {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error('Debe enviar un array de categorías.')
  }
  return await Category.bulkCreate(categories)
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
