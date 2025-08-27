import { Meta } from '../models/Meta'
import { Despesa } from '../models/Despesa'
import { Op } from 'sequelize'

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

  static async progresso(id: string) {
    const meta = await Meta.findByPk(id)
    if (!meta) throw new Error('Meta não encontrada.')
    const inicio = new Date(meta.year, meta.month - 1, 1)
    const fim = new Date(meta.year, meta.month, 0)
    const gasto = await Despesa.sum('valor', {
      where: {
        categoryId: meta.categoryId,
        userId: meta.usuarioId,
        data: { [Op.between]: [inicio, fim] }
      }
    }) || 0
    const limit = Number(meta.limitAmount)
    const percentual = limit > 0 ? +( (Number(gasto) / limit) * 100 ).toFixed(2) : 0
    return {
      metaId: meta.id,
      categoria: meta.categoryId,
      periodo: { mes: meta.month, ano: meta.year },
      limite: limit,
      gasto: Number(gasto),
      restante: Math.max(0, limit - Number(gasto)),
      percentual: percentual > 100 ? 100 : percentual,
      excedido: Number(gasto) > limit
    }
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
