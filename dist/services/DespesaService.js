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
            // atualiza o saldo da conta se o método for PIX, DEBITO ou DINHEIRO
            if (contaId && ['PIX', 'DEBITO', 'DINHEIRO'].includes(metodoPagamento)) {
                const conta = yield Conta_1.Conta.findByPk(contaId);
                if (!conta)
                    throw new Error('Conta não encontrada.');
                conta.saldo = Number(conta.saldo) - Number(valor);
                yield conta.save();
            }
            // se for parcelado e pago no cartão, cria parcelas
            if (parcelado && numeroParcelas > 1) {
                const valorParcela = valor / numeroParcelas;
                for (let i = 1; i <= numeroParcelas; i++) {
                    const dataVencimento = (0, date_fns_1.addMonths)(new Date(dataDespesa), i - 1);
                    yield ParcelaService_1.ParcelaService.create({
                        despesaId: novaDespesa.id,
                        cartaoId: cartaoId || null,
                        numeroParcela: i,
                        valor: valorParcela,
                        dataVencimento
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
            yield despesa.update(data);
            return yield Despesa_1.Despesa.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const despesa = yield Despesa_1.Despesa.findByPk(id);
            if (!despesa)
                throw new Error('Despesa não encontrada.');
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
