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
exports.CashbackService = void 0;
const Cashback_1 = require("../models/Cashback");
const Cartao_1 = require("../models/Cartao");
const Despesa_1 = require("../models/Despesa");
const Conta_1 = require("../models/Conta");
const FaturaService_1 = require("./FaturaService");
const config_1 = require("../config/config");
const includeRelations = [
    { model: Cartao_1.Cartao, as: 'cartao', attributes: ['id', 'nome'] },
    { model: Despesa_1.Despesa, as: 'despesa', attributes: ['id', 'descricao', 'valor'] },
];
class CashbackService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cartaoId, quantidade, description, despesaId, creditDate, appliedTo = 'FATURA' } = data;
            if (!cartaoId || !quantidade || !description || !despesaId || !creditDate) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            if (Number(quantidade) <= 0)
                throw new Error('Quantidade deve ser positiva.');
            const dup = yield Cashback_1.Cashback.findOne({ where: { despesaId } });
            if (dup)
                throw new Error('Já existe cashback para esta despesa.');
            return yield config_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const cashback = yield Cashback_1.Cashback.create({
                    cartaoId,
                    quantidade,
                    description,
                    despesaId,
                    creditDate,
                    appliedTo,
                    applied: false,
                }, { transaction: t });
                // Aplicação imediata
                if (appliedTo === 'FATURA') {
                    // localizar fatura do mês da data do cashback
                    const mes = new Date(creditDate).getMonth() + 1;
                    const ano = new Date(creditDate).getFullYear();
                    const fatura = yield FaturaService_1.FaturaService.findOrCreate(cartaoId, mes, ano);
                    yield FaturaService_1.FaturaService.aplicarDelta(fatura.id, -Number(quantidade));
                }
                else if (appliedTo === 'CONTA') {
                    const cartao = yield Cartao_1.Cartao.findByPk(cartaoId, { transaction: t });
                    if (cartao) {
                        const conta = yield Conta_1.Conta.findByPk(cartao.contaId, { transaction: t });
                        if (conta) {
                            conta.saldo = Number(conta.saldo) + Number(quantidade);
                            yield conta.save({ transaction: t });
                        }
                    }
                }
                cashback.applied = true;
                yield cashback.save({ transaction: t });
                return yield Cashback_1.Cashback.findByPk(cashback.id, { include: includeRelations, transaction: t });
            }));
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cashback_1.Cashback.findAll({ include: includeRelations });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cashback_1.Cashback.findByPk(id, { include: includeRelations });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cashback = yield Cashback_1.Cashback.findByPk(id);
            if (!cashback)
                throw new Error('Cashback não encontrado.');
            yield cashback.update(data);
            return yield Cashback_1.Cashback.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cashback = yield Cashback_1.Cashback.findByPk(id);
            if (!cashback)
                throw new Error('Cashback não encontrado.');
            yield cashback.destroy();
            return true;
        });
    }
}
exports.CashbackService = CashbackService;
