import { Despesa } from '../models/Despesa'
import { Usuario } from '../models/Usuario'
import { Conta } from '../models/Conta'
import { Cartao } from '../models/Cartao'
import { Category } from '../models/Category'
import { Op } from 'sequelize';
import { ParcelaService } from './ParcelaService'
import { addMonths } from 'date-fns'

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Conta, as: 'conta', attributes: ['id', 'bancoNome'] },
  { model: Cartao, as: 'cartao', attributes: ['id', 'nome'] },
  { model: Category, as: 'categoria', attributes: ['id', 'name'] },
]

export class DespesaService {
  // static async create(data: any) {
  //   const {
  //     userId, contaId, cartaoId, categoryId,
  //     descricao, valor, metodoPagamento, data: dataDespesa,
  //     parcelado, numeroParcelas, juros, observacoes
  //   } = data

  //   if (!userId || !categoryId || !descricao || !valor || !metodoPagamento || !dataDespesa) {
  //     throw new Error('Campos obrigatórios não preenchidos.')
  //   }

  //   const novaDespesa = await Despesa.create({
  //     userId,
  //     contaId,
  //     cartaoId,
  //     categoryId,
  //     descricao,
  //     valor,
  //     metodoPagamento,
  //     data: dataDespesa,
  //     parcelado: parcelado || false,
  //     numeroParcelas: numeroParcelas || 1,
  //     juros: juros || 0,
  //     observacoes
  //   })

  //   return await Despesa.findByPk(novaDespesa.id, { include: includeRelations })
  // }

  static async create(data: any) {
    const {
      userId, contaId, cartaoId, categoryId,
      descricao, valor, metodoPagamento, data: dataDespesa,
      parcelado, numeroParcelas, juros, observacoes
    } = data

    if (!userId || !categoryId || !descricao || !valor || !metodoPagamento || !dataDespesa) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    // cria a despesa principal
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

    // atualiza o saldo da conta se o método NÃO for crédito (PIX, DEBITO ou DINHEIRO)
    if (contaId && ['PIX', 'DEBITO', 'DINHEIRO'].includes(metodoPagamento)) {
      const conta = await Conta.findByPk(contaId)
      if (!conta) throw new Error('Conta não encontrada.')

      conta.saldo = Number(conta.saldo) - Number(valor)
      await conta.save()
    }

    // Regras para crédito: sempre criar parcelas vinculadas a faturas
    if (metodoPagamento === 'CREDITO' && cartaoId) {
      const totalParcelas = parcelado && numeroParcelas > 1 ? numeroParcelas : 1
      const valorParcela = parcelado && numeroParcelas > 1 ? valor / numeroParcelas : valor
      for (let i = 1; i <= totalParcelas; i++) {
        const dataVencimento = addMonths(new Date(dataDespesa), i - 1)
        await ParcelaService.create({
          despesaId: novaDespesa.id,
          cartaoId,
          numeroParcela: i,
          valor: valorParcela,
          dataVencimento,
        })
      }
    } else if (parcelado && numeroParcelas > 1) {
      // Parcelado mas não é crédito -> cria registros de parcelas sem cartao/fatura (se regra de negócio exigir)
      const valorParcela = valor / numeroParcelas
      for (let i = 1; i <= numeroParcelas; i++) {
        const dataVencimento = addMonths(new Date(dataDespesa), i - 1)
        await ParcelaService.create({
          despesaId: novaDespesa.id,
          cartaoId: null,
          numeroParcela: i,
          valor: valorParcela,
          dataVencimento,
        })
      }
    }

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
