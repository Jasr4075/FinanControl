"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DespesaService = void 0;
const Despesa_1 = require("../models/Despesa");
const Usuario_1 = require("../models/Usuario");
const Conta_1 = require("../models/Conta");
const Cartao_1 = require("../models/Cartao");
const Category_1 = require("../models/Category");
const sequelize_1 = require("sequelize");
const ParcelaService_1 = require("./ParcelaService");
const date_fns_1 = require("date-fns");
const includeRelations = [
    { model: Usuario_1.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
    { model: Conta_1.Conta, as: 'conta', attributes: ['id', 'bancoNome'] },
    { model: Cartao_1.Cartao, as: 'cartao', attributes: ['id', 'nome'] },
    { model: Category_1.Category, as: 'categoria', attributes: ['id', 'name'] },
];
class DespesaService {
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
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, contaId, cartaoId, categoryId, descricao, valor, metodoPagamento, data: dataDespesa, parcelado, numeroParcelas, juros, observacoes } = data;
            if (!userId || !categoryId || !descricao || !valor || !metodoPagamento || !dataDespesa) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            if (Number(valor) <= 0) {
                throw new Error('Valor deve ser maior que zero.');
            }
            if (parcelado) {
                if (!numeroParcelas || !Number.isInteger(numeroParcelas) || numeroParcelas < 1) {
                    throw new Error('Número de parcelas inválido.');
                }
            }
            // Regra: parcelamento somente permitido para compras no cartão (CREDITO)
            if (parcelado && metodoPagamento !== 'CREDITO') {
                throw new Error('Parcelamento só é permitido para método CREDITO.');
            }
            // cria a despesa principal
            const novaDespesa = yield Despesa_1.Despesa.create({
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
            });
            // atualiza o saldo da conta se o método NÃO for crédito (PIX, DEBITO ou DINHEIRO)
            if (contaId && ['PIX', 'DEBITO', 'DINHEIRO'].includes(metodoPagamento)) {
                const conta = yield Conta_1.Conta.findByPk(contaId);
                if (!conta)
                    throw new Error('Conta não encontrada.');
                conta.saldo = Number(conta.saldo) - Number(valor);
                yield conta.save();
            }
            // Regras para crédito: sempre criar parcelas vinculadas a faturas
            if (metodoPagamento === 'CREDITO' && cartaoId) {
                const cartao = yield Cartao_1.Cartao.findByPk(cartaoId);
                if (!cartao)
                    throw new Error('Cartão não encontrado.');
                const totalParcelas = parcelado && numeroParcelas > 1 ? numeroParcelas : 1;
                const valorBase = Number(valor);
                const totalComJuros = juros && juros > 0 ? +(valorBase * (1 + juros / 100)).toFixed(2) : valorBase;
                // usar totalComJuros como consumo de limite
                if (cartao.creditLimit && Number(cartao.creditLimit) > 0) {
                    const novoUso = Number(cartao.creditUsed || 0) + totalComJuros;
                    if (novoUso > Number(cartao.creditLimit)) {
                        throw new Error('Limite de crédito insuficiente.');
                    }
                    cartao.creditUsed = novoUso;
                    yield cartao.save();
                }
                // distribuir parcelas
                const baseParcela = Math.floor((totalComJuros / totalParcelas) * 100) / 100;
                let acumulado = 0;
                for (let i = 1; i <= totalParcelas; i++) {
                    let valorParcela = baseParcela;
                    if (i === totalParcelas) {
                        valorParcela = +(totalComJuros - acumulado).toFixed(2);
                    }
                    acumulado += valorParcela;
                    const dataVencimento = (0, date_fns_1.addMonths)(new Date(dataDespesa), i - 1);
                    yield ParcelaService_1.ParcelaService.create({
                        despesaId: novaDespesa.id,
                        cartaoId,
                        numeroParcela: i,
                        valor: valorParcela,
                        dataVencimento,
                    });
                }
            }
            return yield Despesa_1.Despesa.findByPk(novaDespesa.id, { include: includeRelations });
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Despesa_1.Despesa.findAll({ include: includeRelations });
        });
    }
    static list(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, page = 1, pageSize = 20, dataInicio, dataFim, categoryId, metodoPagamento, cartaoId } = params;
            const where = { userId };
            if (dataInicio && dataFim)
                where.data = { [sequelize_1.Op.between]: [dataInicio, dataFim] };
            else if (dataInicio)
                where.data = { [sequelize_1.Op.gte]: dataInicio };
            else if (dataFim)
                where.data = { [sequelize_1.Op.lte]: dataFim };
            if (categoryId)
                where.categoryId = categoryId;
            if (metodoPagamento)
                where.metodoPagamento = metodoPagamento;
            if (cartaoId)
                where.cartaoId = cartaoId;
            const offset = (page - 1) * pageSize;
            const { rows, count } = yield Despesa_1.Despesa.findAndCountAll({ where, limit: pageSize, offset, order: [['data', 'DESC']], include: includeRelations });
            return { data: rows, total: count, page, pageSize, totalPages: Math.ceil(count / pageSize) };
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const despesa = yield Despesa_1.Despesa.findByPk(id, { include: includeRelations });
            if (!despesa)
                throw new Error('Despesa não encontrada.');
            return despesa;
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const despesa = yield Despesa_1.Despesa.findByPk(id);
            if (!despesa)
                throw new Error('Despesa não encontrada.');
            const original = despesa.toJSON();
            // Ajustar saldo para métodos não crédito se valor/metodo mudarem
            if (data.valor && Number(data.valor) <= 0)
                throw new Error('Valor deve ser maior que zero.');
            if (data.parcelado && despesa.metodoPagamento !== 'CREDITO')
                throw new Error('Parcelamento só permitido para crédito.');
            const aplicarSaldo = () => __awaiter(this, void 0, void 0, function* () {
                if (['PIX', 'DEBITO', 'DINHEIRO'].includes(original.metodoPagamento) && original.contaId) {
                    const conta = yield Conta_1.Conta.findByPk(original.contaId);
                    if (conta) {
                        // devolver valor antigo
                        conta.saldo = Number(conta.saldo) + Number(original.valor);
                        yield conta.save();
                    }
                }
                if (['PIX', 'DEBITO', 'DINHEIRO'].includes(data.metodoPagamento || despesa.metodoPagamento) && (data.contaId || despesa.contaId)) {
                    const conta = yield Conta_1.Conta.findByPk(data.contaId || despesa.contaId);
                    if (conta) {
                        conta.saldo = Number(conta.saldo) - Number(data.valor || despesa.valor);
                        yield conta.save();
                    }
                }
            });
            yield aplicarSaldo();
            yield despesa.update(data);
            return yield Despesa_1.Despesa.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const despesa = yield Despesa_1.Despesa.findByPk(id);
            if (!despesa)
                throw new Error('Despesa não encontrada.');
            // Reverter saldo se necessário
            if (['PIX', 'DEBITO', 'DINHEIRO'].includes(despesa.metodoPagamento) && despesa.contaId) {
                const conta = yield Conta_1.Conta.findByPk(despesa.contaId);
                if (conta) {
                    conta.saldo = Number(conta.saldo) + Number(despesa.valor);
                    yield conta.save();
                }
            }
            // Reverter crédito usado (simplificado: usar valor + juros se armazenado)
            if (despesa.metodoPagamento === 'CREDITO' && despesa.cartaoId) {
                const cartao = yield Cartao_1.Cartao.findByPk(despesa.cartaoId);
                if (cartao) {
                    const valorBase = Number(despesa.valor);
                    // juros armazenado no campo juros percentual
                    const totalComJuros = despesa.juros && Number(despesa.juros) > 0 ? +(valorBase * (1 + Number(despesa.juros) / 100)).toFixed(2) : valorBase;
                    cartao.creditUsed = Math.max(0, Number(cartao.creditUsed || 0) - totalComJuros);
                    yield cartao.save();
                }
            }
            yield despesa.destroy();
            return true;
        });
    }
    static getTotalMes(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const hoje = new Date();
            return (yield Despesa_1.Despesa.sum('valor', {
                where: {
                    userId,
                    data: { [sequelize_1.Op.between]: [inicioMes, hoje] }
                }
            })) || 0;
        });
    }
    static getTotalByMonth(userId, ano, mes) {
        return __awaiter(this, void 0, void 0, function* () {
            const inicio = new Date(ano, mes - 1, 1);
            const fim = new Date(ano, mes, 0, 23, 59, 59, 999);
            return (yield Despesa_1.Despesa.sum('valor', {
                where: { userId, data: { [sequelize_1.Op.between]: [inicio, fim] } }
            })) || 0;
        });
    }
    static getUltimas(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 10) {
            return yield Despesa_1.Despesa.findAll({
                where: { userId },
                order: [['data', 'DESC']],
                limit,
                include: includeRelations,
            });
        });
    }
}
exports.DespesaService = DespesaService;
