import { Category } from '../models/Category'

export class CategoryService {
  static async create(name: string) {
    if (!name) throw new Error('Nome da categoria é obrigatório.')

    return await Category.create({ name })
  }

  static async findAll() {
    return await Category.findAll()
  }

  static async findById(id: string) {
    return await Category.findByPk(id)
  }

  static async update(id: string, name: string) {
    if (!name) throw new Error('Nome da categoria é obrigatório para atualização.')

    const category = await Category.findByPk(id)
    if (!category) throw new Error('Categoria não encontrada.')

    await category.update({ name })
    return category
  }

  static async delete(id: string) {
    const category = await Category.findByPk(id)
    if (!category) throw new Error('Categoria não encontrada.')

    await category.destroy()
  }
}
