import { Meta } from '../models/Meta'

const includeRelations = [
  { model: Meta.sequelize!.models.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Meta.sequelize!.models.Category, as: 'categoria', attributes: ['id', 'name'] },
]

export class MetaService {
  static async create(data: {
    usuarioId: string
    categoryId: string
    limitAmount: number
    month: number
    year: number
  }) {
    const { usuarioId, categoryId, limitAmount, month, year } = data

    if (!usuarioId || !categoryId || !limitAmount || !month || !year) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    if (month < 1 || month > 12) {
      throw new Error('Mês inválido. Deve estar entre 1 e 12.')
    }

    const novaMeta = await Meta.create({
      usuarioId,
      categoryId,
      limitAmount,
      month,
      year,
    })

    return await Meta.findByPk(novaMeta.id, { include: includeRelations })
  }

  static async getAll() {
    return await Meta.findAll({ include: includeRelations })
  }

  static async getById(id: string) {
    const meta = await Meta.findByPk(id, { include: includeRelations })
    if (!meta) {
      throw new Error('Meta não encontrada.')
    }
    return meta
  }

  static async update(id: string, data: any) {
    const meta = await Meta.findByPk(id)
    if (!meta) {
      throw new Error('Meta não encontrada.')
    }

    if (data.month && (data.month < 1 || data.month > 12)) {
      throw new Error('Mês inválido. Deve estar entre 1 e 12.')
    }

    await meta.update({
      usuarioId: data.usuarioId ?? meta.usuarioId,
      categoryId: data.categoryId ?? meta.categoryId,
      limitAmount: data.limitAmount ?? meta.limitAmount,
      month: data.month ?? meta.month,
      year: data.year ?? meta.year,
    })

    return await Meta.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string) {
    const meta = await Meta.findByPk(id)
    if (!meta) {
      throw new Error('Meta não encontrada.')
    }
    await meta.destroy()
    return { message: 'Meta excluída com sucesso.' }
  }
}
