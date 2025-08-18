import { Cashback } from '../models/Cashback'
import { Cartao } from '../models/Cartao'
import { Despesa } from '../models/Despesa'

const includeRelations = [
  { model: Cartao, as: 'cartao', attributes: ['id', 'nome'] },
  { model: Despesa, as: 'despesa', attributes: ['id', 'descricao', 'valor'] },
]

export class CashbackService {
  static async create(data: {
    cartaoId: string
    quantidade: number
    description: string
    despesaId: string
    creditDate: Date
  }) {
    const { cartaoId, quantidade, description, despesaId, creditDate } = data

    if (!cartaoId || !quantidade || !description || !despesaId || !creditDate) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    const novoCashback = await Cashback.create({
      cartaoId,
      quantidade,
      description,
      despesaId,
      creditDate,
    })

    return await Cashback.findByPk(novoCashback.id, { include: includeRelations })
  }

  static async findAll() {
    return await Cashback.findAll({ include: includeRelations })
  }

  static async findById(id: string) {
    return await Cashback.findByPk(id, { include: includeRelations })
  }

  static async update(id: string, data: Partial<{
    cartaoId: string
    quantidade: number
    description: string
    despesaId: string
    creditDate: Date
  }>) {
    const cashback = await Cashback.findByPk(id)
    if (!cashback) throw new Error('Cashback não encontrado.')

    await cashback.update(data)
    return await Cashback.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string): Promise<boolean> {
    const cashback = await Cashback.findByPk(id);
    if (!cashback) throw new Error('Cashback não encontrado.');
  
    await cashback.destroy();
    return true;
  }
  
}
