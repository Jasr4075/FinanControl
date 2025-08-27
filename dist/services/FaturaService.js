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
exports.FaturaService = void 0;
const Fatura_1 = require("../models/Fatura");
const Parcela_1 = require("../models/Parcela");
const Conta_1 = require("../models/Conta");
const Cartao_1 = require("../models/Cartao");
const Despesa_1 = require("../models/Despesa");
const config_1 = require("../config/config");
const includeRelations = [
    { model: Fatura_1.Fatura.sequelize.models.Cartao, as: 'cartao', attributes: ['id', 'nome', 'type'] },
];
class FaturaService {
    /**
     * Encontra uma fatura pelo cartão + mês + ano ou cria uma nova se não existir.
     * Não marca como paga e inicia valorTotal em 0.
     */
    static findOrCreate(cartaoId, mes, ano) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cartaoId || !mes || !ano)
                throw new Error('Parâmetros insuficientes para localizar/criar fatura.');
            if (mes < 1 || mes > 12)
                throw new Error('Mês inválido. Deve estar entre 1 e 12.');
            let fatura = yield Fatura_1.Fatura.findOne({ where: { cartaoId, mes, ano } });
            if (!fatura) {
                fatura = yield Fatura_1.Fatura.create({
                    cartaoId,
                    mes,
                    ano,
                    valorTotal: 0,
                    valorPago: 0,
                    paga: true, // fatura vazia é considerada paga
                    dataPagamento: null,
                });
            }
            return fatura;
        });
    }
    /**
     * Recalcula o valorTotal de uma fatura somando as parcelas associadas.
     */
    static recomputeValorTotal(faturaId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const fatura = yield Fatura_1.Fatura.findByPk(faturaId);
            if (!fatura)
                throw new Error('Fatura não encontrada.');
            const total = yield Parcela_1.Parcela.sum('valor', { where: { faturaId } });
            fatura.valorTotal = Number(total || 0);
            if (Number(fatura.valorTotal) === 0) {
                fatura.paga = true;
                fatura.dataPagamento = (_a = fatura.dataPagamento) !== null && _a !== void 0 ? _a : new Date();
            }
            if (Number(fatura.valorPago) >= Number(fatura.valorTotal)) {
                fatura.paga = true;
                fatura.dataPagamento = (_b = fatura.dataPagamento) !== null && _b !== void 0 ? _b : new Date();
            }
            else if (Number(fatura.valorPago) > 0) {
                fatura.paga = false;
            }
            yield fatura.save();
            return fatura;
        });
    }
    /**
     * Paga a fatura debitando o valorTotal da conta informada.
     * Mantém fatura aberta para novas despesas se for antes do fechamento? Regra: pagamento antecipado não impede novas parcelas futuras; logo apenas marca paga se não houver saldo futuro.
     * Implementação mínima: marcar paga sempre que valorTotal > 0 e débito concluído.
     */
    static pagar(id, contaId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield config_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const fatura = yield Fatura_1.Fatura.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
                if (!fatura)
                    throw new Error('Fatura não encontrada.');
                if (Number(fatura.valorTotal) === 0) {
                    fatura.paga = true;
                    fatura.dataPagamento = (_a = fatura.dataPagamento) !== null && _a !== void 0 ? _a : new Date();
                    return fatura;
                }
                if (Number(fatura.valorPago) >= Number(fatura.valorTotal))
                    return fatura;
                const conta = yield Conta_1.Conta.findByPk(contaId, { transaction: t, lock: t.LOCK.UPDATE });
                if (!conta)
                    throw new Error('Conta não encontrada.');
                const restante = Number(fatura.valorTotal) - Number(fatura.valorPago);
                if (restante <= 0)
                    return fatura;
                if (restante > Number(conta.saldo))
                    throw new Error('Saldo insuficiente para pagamento da fatura.');
                conta.saldo = Number(conta.saldo) - restante;
                yield conta.save({ transaction: t });
                fatura.valorPago = Number(fatura.valorPago) + restante;
                if (Number(fatura.valorPago) >= Number(fatura.valorTotal)) {
                    fatura.paga = true;
                    fatura.dataPagamento = (_b = fatura.dataPagamento) !== null && _b !== void 0 ? _b : new Date();
                    // Ajustar creditUsed do cartão ao quitar totalmente
                    const cartao = yield Cartao_1.Cartao.findByPk(fatura.cartaoId, { transaction: t, lock: t.LOCK.UPDATE });
                    if (cartao) {
                        const novoUsed = Number(cartao.creditUsed) - Number(fatura.valorTotal);
                        cartao.creditUsed = (novoUsed < 0 ? 0 : novoUsed);
                        yield cartao.save({ transaction: t });
                    }
                }
                yield fatura.save({ transaction: t });
                return fatura;
            }));
        });
    }
    /**
     * Aplica delta simples no valorTotal (uso interno opcional).
     */
    static aplicarDelta(faturaId, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const fatura = yield Fatura_1.Fatura.findByPk(faturaId);
            if (!fatura)
                throw new Error('Fatura não encontrada.');
            fatura.valorTotal = Number(fatura.valorTotal || 0) + delta;
            if (fatura.valorTotal < 0)
                fatura.valorTotal = 0;
            if (Number(fatura.valorTotal) === 0) {
                fatura.paga = true;
                fatura.dataPagamento = (_a = fatura.dataPagamento) !== null && _a !== void 0 ? _a : new Date();
                fatura.valorPago = fatura.valorTotal;
            }
            else if (Number(fatura.valorPago) >= Number(fatura.valorTotal)) {
                fatura.paga = true;
                fatura.dataPagamento = (_b = fatura.dataPagamento) !== null && _b !== void 0 ? _b : new Date();
            }
            else {
                fatura.paga = false;
            }
            yield fatura.save();
            return fatura;
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cartaoId, mes, ano, valorTotal = 0, paga = false, dataPagamento = null } = data;
            if (!cartaoId || !mes || !ano) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            if (mes < 1 || mes > 12) {
                throw new Error('Mês inválido. Deve estar entre 1 e 12.');
            }
            const novaFatura = yield Fatura_1.Fatura.create({
                cartaoId,
                mes,
                ano,
                valorTotal,
                valorPago: valorTotal === 0 ? 0 : 0,
                paga: valorTotal === 0 ? true : paga,
                dataPagamento: valorTotal === 0 ? new Date() : dataPagamento,
            });
            return yield Fatura_1.Fatura.findByPk(novaFatura.id, { include: includeRelations });
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Fatura_1.Fatura.findAll({ include: includeRelations });
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fatura = yield Fatura_1.Fatura.findByPk(id, { include: includeRelations });
            if (!fatura) {
                throw new Error('Fatura não encontrada.');
            }
            return fatura;
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fatura = yield Fatura_1.Fatura.findByPk(id);
            if (!fatura) {
                throw new Error('Fatura não encontrada.');
            }
            if (data.mes && (data.mes < 1 || data.mes > 12)) {
                throw new Error('Mês inválido. Deve estar entre 1 e 12.');
            }
            yield fatura.update(data);
            return yield Fatura_1.Fatura.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fatura = yield Fatura_1.Fatura.findByPk(id);
            if (!fatura) {
                throw new Error('Fatura não encontrada.');
            }
            yield fatura.destroy();
            return { message: 'Fatura excluída com sucesso.' };
        });
    }
    static detalhe(faturaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fatura = yield Fatura_1.Fatura.findByPk(faturaId, {
                include: [
                    ...includeRelations,
                    {
                        model: Parcela_1.Parcela,
                        as: 'parcelas',
                        include: [
                            {
                                model: Despesa_1.Despesa,
                                as: 'despesa',
                                attributes: ['id', 'descricao', 'valor', 'metodoPagamento', 'data'],
                            },
                        ],
                    },
                ],
                order: [[{ model: Parcela_1.Parcela, as: 'parcelas' }, 'numeroParcela', 'ASC']],
            });
            if (!fatura)
                throw new Error('Fatura não encontrada.');
            const restante = Number(fatura.valorTotal) - Number(fatura.valorPago);
            const percentPago = Number(fatura.valorTotal) > 0 ? +(Number(fatura.valorPago) / Number(fatura.valorTotal) * 100).toFixed(2) : 100;
            return { fatura, resumo: { restante, percentPago } };
        });
    }
    static byCartaoMes(cartaoId_1, mes_1, ano_1) {
        return __awaiter(this, arguments, void 0, function* (cartaoId, mes, ano, createIfMissing = true) {
            let fatura = yield Fatura_1.Fatura.findOne({ where: { cartaoId, mes, ano } });
            if (!fatura && createIfMissing) {
                fatura = yield this.findOrCreate(cartaoId, mes, ano);
            }
            if (!fatura)
                throw new Error('Fatura não encontrada.');
            return this.detalhe(fatura.id);
        });
    }
    static atual(cartaoId_1) {
        return __awaiter(this, arguments, void 0, function* (cartaoId, referenceDate = new Date()) {
            const mes = referenceDate.getMonth() + 1;
            const ano = referenceDate.getFullYear();
            return this.byCartaoMes(cartaoId, mes, ano, true);
        });
    }
    static listByCartao(cartaoId_1) {
        return __awaiter(this, arguments, void 0, function* (cartaoId, page = 1, pageSize = 6) {
            if (page < 1)
                page = 1;
            const offset = (page - 1) * pageSize;
            const { count, rows } = yield Fatura_1.Fatura.findAndCountAll({
                where: { cartaoId },
                order: [['ano', 'DESC'], ['mes', 'DESC']],
                offset,
                limit: pageSize,
            });
            return {
                data: rows,
                page,
                pageSize,
                total: count,
                totalPages: Math.ceil(count / pageSize),
            };
        });
    }
}
exports.FaturaService = FaturaService;
