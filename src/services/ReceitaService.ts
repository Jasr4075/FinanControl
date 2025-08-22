import { Receita } from '../models/Receita'
import { Usuario } from '../models/Usuario'
import { Conta } from '../models/Conta'
import { Category } from '../models/Category'
import { Op } from 'sequelize';
import { sequelize } from '../config/config'

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
    // Começa uma transação
    return await sequelize.transaction(async (t) => {
      // Cria a receita
      const receita = await Receita.create(
        {
          ...data,
          nota: data.nota ?? undefined,
        },
        { transaction: t }
      );

      // Atualiza o saldo da conta
      const conta = await Conta.findByPk(data.accountId, { transaction: t });
      if (!conta) throw new Error('Conta não encontrada.');

      conta.saldo = (conta.saldo || 0) + data.quantidade;
      await conta.save({ transaction: t });

      // Retorna a receita com os relacionamentos
      return Receita.findByPk(receita.id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { model: Conta, as: 'contas', attributes: ['id', 'bancoNome', 'conta'] },
          { model: Category, as: 'categories', attributes: ['id', 'name'] },
        ],
        transaction: t,
      });
    });
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

  static async getTotalMes(userId: string) {
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const hoje = new Date()

    return await Receita.sum('quantidade', {
      where: {
        userId,
        data: { [Op.between]: [inicioMes, hoje] }
      }
    }) || 0
  }

  static async getUltimas(userId: string, limit = 10) {
    return await Receita.findAll({
      where: { userId },
      order: [['data', 'DESC']],
      limit,
      include: includeRelations,
    })
  }
}
