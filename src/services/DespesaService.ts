import { Despesa } from '../models/Despesa'
import { Usuario } from '../models/Usuario'
import { Conta } from '../models/Conta'
import { Cartao } from '../models/Cartao'
import { Category } from '../models/Category'
import { Op } from 'sequelize';
import { ParcelaService } from './ParcelaService'
import { addMonths } from 'date-fns'
import { sequelize } from '../config/config'

const includeRelations = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Conta, as: 'conta', attributes: ['id', 'bancoNome'] },
  { model: Cartao, as: 'cartao', attributes: ['id', 'nome'] },
  { model: Category, as: 'categoria', attributes: ['id', 'name'] },
]

export class DespesaService {
// adiciona no final da classe DespesaService
static async deleteByPaymentId(paymentId: string) {
  const despesa = await Despesa.findOne({ where: { observacoes: { [Op.iLike]: `%${paymentId}%` } } })
  if (!despesa) return null

  // Reverter saldo se necessário
  if (['PIX', 'DEBITO', 'DINHEIRO'].includes(despesa.metodoPagamento) && despesa.contaId) {
    const conta = await Conta.findByPk(despesa.contaId)
    if (conta) {
      conta.saldo = Number(conta.saldo) + Number(despesa.valor)
      await conta.save()
    }
  }

  // Reverter crédito usado
  if (despesa.metodoPagamento === 'CREDITO' && despesa.cartaoId) {
    const cartao = await Cartao.findByPk(despesa.cartaoId)
    if (cartao) {
      const totalComJuros = despesa.juros && Number(despesa.juros) > 0
        ? +(Number(despesa.valor) * (1 + Number(despesa.juros)/100)).toFixed(2)
        : Number(despesa.valor)
      cartao.creditUsed = Math.max(0, Number(cartao.creditUsed || 0) - totalComJuros) as any
      await cartao.save()
    }
  }

  await despesa.destroy()
  return true
}

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

    if (Number(valor) <= 0) {
      throw new Error('Valor deve ser maior que zero.')
    }
    if (parcelado) {
      if (!numeroParcelas || !Number.isInteger(numeroParcelas) || numeroParcelas < 1) {
        throw new Error('Número de parcelas inválido.')
      }
    }

    // Regra: parcelamento somente permitido para compras no cartão (CREDITO)
    if (parcelado && metodoPagamento !== 'CREDITO') {
      throw new Error('Parcelamento só é permitido para método CREDITO.')
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
      const cartao = await Cartao.findByPk(cartaoId)
      if (!cartao) throw new Error('Cartão não encontrado.')
      const totalParcelas = parcelado && numeroParcelas > 1 ? numeroParcelas : 1
      const valorBase = Number(valor)
      const totalComJuros = juros && juros > 0 ? +(valorBase * (1 + juros / 100)).toFixed(2) : valorBase
      // usar totalComJuros como consumo de limite
      if (cartao.creditLimit && Number(cartao.creditLimit) > 0) {
        const novoUso = Number(cartao.creditUsed || 0) + totalComJuros
        if (novoUso > Number(cartao.creditLimit)) {
          throw new Error('Limite de crédito insuficiente.')
        }
        cartao.creditUsed = novoUso as any
        await cartao.save()
      }
      // distribuir parcelas
      const baseParcela = Math.floor((totalComJuros / totalParcelas) * 100) / 100
      let acumulado = 0
      for (let i = 1; i <= totalParcelas; i++) {
        let valorParcela = baseParcela
        if (i === totalParcelas) {
          valorParcela = +(totalComJuros - acumulado).toFixed(2)
        }
        acumulado += valorParcela
        const dataVencimento = addMonths(new Date(dataDespesa), i - 1)
        await ParcelaService.create({
          despesaId: novaDespesa.id,
          cartaoId,
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

  static async list(params: {
    userId: string
    page?: number
    pageSize?: number
    dataInicio?: Date | string
    dataFim?: Date | string
    categoryId?: string
    metodoPagamento?: string
    cartaoId?: string
  }) {
    const { userId, page = 1, pageSize = 20, dataInicio, dataFim, categoryId, metodoPagamento, cartaoId } = params
    const where: any = { userId }
    if (dataInicio && dataFim) where.data = { [Op.between]: [dataInicio, dataFim] }
    else if (dataInicio) where.data = { [Op.gte]: dataInicio }
    else if (dataFim) where.data = { [Op.lte]: dataFim }
    if (categoryId) where.categoryId = categoryId
    if (metodoPagamento) where.metodoPagamento = metodoPagamento
    if (cartaoId) where.cartaoId = cartaoId
    const offset = (page - 1) * pageSize
    const { rows, count } = await Despesa.findAndCountAll({ where, limit: pageSize, offset, order: [['data', 'DESC']], include: includeRelations })
    return { data: rows, total: count, page, pageSize, totalPages: Math.ceil(count / pageSize) }
  }

  static async getById(id: string) {
    const despesa = await Despesa.findByPk(id, { include: includeRelations })
    if (!despesa) throw new Error('Despesa não encontrada.')
    return despesa
  }

  static async update(id: string, data: any) {
    const despesa = await Despesa.findByPk(id)
    if (!despesa) throw new Error('Despesa não encontrada.')
    const original = despesa.toJSON() as any
    // Ajustar saldo para métodos não crédito se valor/metodo mudarem
    if (data.valor && Number(data.valor) <= 0) throw new Error('Valor deve ser maior que zero.')
    if (data.parcelado && despesa.metodoPagamento !== 'CREDITO') throw new Error('Parcelamento só permitido para crédito.')

    const aplicarSaldo = async () => {
      if (['PIX', 'DEBITO', 'DINHEIRO'].includes(original.metodoPagamento) && original.contaId) {
        const conta = await Conta.findByPk(original.contaId)
        if (conta) {
          // devolver valor antigo
            conta.saldo = Number(conta.saldo) + Number(original.valor)
            await conta.save()
        }
      }
      if (['PIX', 'DEBITO', 'DINHEIRO'].includes(data.metodoPagamento || despesa.metodoPagamento) && (data.contaId || despesa.contaId)) {
        const conta = await Conta.findByPk(data.contaId || despesa.contaId)
        if (conta) {
          conta.saldo = Number(conta.saldo) - Number(data.valor || despesa.valor)
          await conta.save()
        }
      }
    }
    await aplicarSaldo()
    await despesa.update(data)
    return await Despesa.findByPk(id, { include: includeRelations })
  }

  static async delete(id: string): Promise<boolean> {
    const despesa = await Despesa.findByPk(id);
    if (!despesa) throw new Error('Despesa não encontrada.');
    // Reverter saldo se necessário
    if (['PIX', 'DEBITO', 'DINHEIRO'].includes(despesa.metodoPagamento) && despesa.contaId) {
      const conta = await Conta.findByPk(despesa.contaId)
      if (conta) {
        conta.saldo = Number(conta.saldo) + Number(despesa.valor)
        await conta.save()
      }
    }
    // Reverter crédito usado (simplificado: usar valor + juros se armazenado)
    if (despesa.metodoPagamento === 'CREDITO' && despesa.cartaoId) {
      const cartao = await Cartao.findByPk(despesa.cartaoId)
      if (cartao) {
        const valorBase = Number(despesa.valor)
        // juros armazenado no campo juros percentual
        const totalComJuros = despesa.juros && Number(despesa.juros) > 0 ? +(valorBase * (1 + Number(despesa.juros)/100)).toFixed(2) : valorBase
        cartao.creditUsed = Math.max(0, Number(cartao.creditUsed || 0) - totalComJuros) as any
        await cartao.save()
      }
    }
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

  static async getTotalByMonth(userId: string, ano: number, mes: number) { // mes 1-12
    const inicio = new Date(ano, mes - 1, 1)
    const fim = new Date(ano, mes, 0, 23, 59, 59, 999)
    return await Despesa.sum('valor', {
      where: { userId, data: { [Op.between]: [inicio, fim] } }
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
