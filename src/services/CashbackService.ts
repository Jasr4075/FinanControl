import { Cashback } from '../models/Cashback'
import { Cartao } from '../models/Cartao'
import { Despesa } from '../models/Despesa'
import { Fatura } from '../models/Fatura'
import { Conta } from '../models/Conta'
import { FaturaService } from './FaturaService'
import { sequelize } from '../config/config'

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
    appliedTo?: 'FATURA' | 'CONTA'
  }) {
    const { cartaoId, quantidade, description, despesaId, creditDate, appliedTo = 'FATURA' } = data
    if (!cartaoId || !quantidade || !description || !despesaId || !creditDate) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }
    if (Number(quantidade) <= 0) throw new Error('Quantidade deve ser positiva.')
    const dup = await Cashback.findOne({ where: { despesaId } })
    if (dup) throw new Error('Já existe cashback para esta despesa.')

    return await sequelize.transaction(async (t) => {
      const cashback = await Cashback.create({
        cartaoId,
        quantidade,
        description,
        despesaId,
        creditDate,
        appliedTo,
        applied: false,
      }, { transaction: t })

      // Aplicação imediata
      if (appliedTo === 'FATURA') {
        // localizar fatura do mês da data do cashback
        const mes = new Date(creditDate).getMonth() + 1
        const ano = new Date(creditDate).getFullYear()
        const fatura = await FaturaService.findOrCreate(cartaoId, mes, ano)
        await FaturaService.aplicarDelta(fatura.id, -Number(quantidade))
      } else if (appliedTo === 'CONTA') {
        const cartao = await Cartao.findByPk(cartaoId, { transaction: t })
        if (cartao) {
          const conta = await Conta.findByPk((cartao as any).contaId, { transaction: t })
          if (conta) {
            conta.saldo = Number(conta.saldo) + Number(quantidade)
            await conta.save({ transaction: t })
          }
        }
      }
      cashback.applied = true
      await cashback.save({ transaction: t })
      return await Cashback.findByPk(cashback.id, { include: includeRelations, transaction: t })
    })
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
