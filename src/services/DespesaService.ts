import { Despesa } from '../models/Despesa'
import { Usuario } from '../models/Usuario'
import { Conta } from '../models/Conta'
import { Cartao } from '../models/Cartao'
import { Category } from '../models/Category'
import { Op } from 'sequelize';

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Conta, as: 'conta', attributes: ['id', 'bancoNome'] },
  { model: Cartao, as: 'cartao', attributes: ['id', 'nome'] },
  { model: Category, as: 'categoria', attributes: ['id', 'name'] },
]

export class DespesaService {
  static async create(data: any) {
    const {
      userId, contaId, cartaoId, categoryId,
      descricao, valor, metodoPagamento, data: dataDespesa,
      parcelado, numeroParcelas, juros, observacoes
    } = data

    if (!userId || !categoryId || !descricao || !valor || !metodoPagamento || !dataDespesa) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    const novaDespesa = await Despesa.create({
      userId,
      contaId,
      cartaoId,
      categoryId,
      descricao,
      valor,
      metodoPagamento,
      data: dataDespesa,
      parcelado: parcelado || false,
      numeroParcelas: numeroParcelas || 1,
      juros: juros || 0,
      observacoes
    })

    return await Despesa.findByPk(novaDespesa.id, { include: includeRelations })
  }

  static async getAll() {
    return await Despesa.findAll({ include: includeRelations })
  }

  static async getById(id: string) {
    const despesa = await Despesa.findByPk(id, { include: includeRelations })
    if (!despesa) throw new Error('Despesa não encontrada.')
    return despesa
  }

  static async update(id: string, data: any) {
    const despesa = await Despesa.findByPk(id)
    if (!despesa) throw new Error('Despesa não encontrada.')

    await despesa.update(data)
    return await Despesa.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string): Promise<boolean> {
    const despesa = await Despesa.findByPk(id);
    if (!despesa) throw new Error('Despesa não encontrada.');
    await despesa.destroy();
    return true;
  }

  static async getTotalMes(userId: string) {
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const hoje = new Date()

    return await Despesa.sum('valor', {
      where: {
        userId,
        data: { [Op.between]: [inicioMes, hoje] }
      }
    }) || 0
  }

  static async getUltimas(userId: string, limit = 10) {
    return await Despesa.findAll({
      where: { userId },
      order: [['data', 'DESC']],
      limit,
      include: includeRelations,
    })
  }

}
