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
exports.CartaoService = void 0;
const Cartao_1 = require("../models/Cartao");
const Usuario_1 = require("../models/Usuario");
const Conta_1 = require("../models/Conta");
const includeRelations = [
    { model: Usuario_1.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
    { model: Conta_1.Conta, as: 'conta', attributes: ['id', 'bancoNome', 'agencia', 'conta', 'saldo'] },
];
class CartaoService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, contaId, nome, type, creditLimit = 0, hasCashback = false, cashbackPercent = 0, closingDay, dueDay, active = true, } = data;
            // Valida campos obrigatórios gerais
            if (!userId || !contaId || !nome || !type) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            // Valida obrigatoriedade de closingDay/dueDay apenas para CREDITO ou MISTO
            if ((type === 'CREDITO' || type === 'MISTO') && (closingDay === undefined || dueDay === undefined)) {
                throw new Error('closingDay e dueDay são obrigatórios para cartões de crédito ou misto.');
            }
            // Validações adicionais
            if (creditLimit < 0)
                throw new Error('Limite de crédito não pode ser negativo.');
            if (cashbackPercent < 0 || cashbackPercent > 100)
                throw new Error('Cashback deve estar entre 0 e 100%.');
            if (closingDay !== undefined && (closingDay < 1 || closingDay > 28))
                throw new Error('Dia de fechamento deve estar entre 1 e 28.');
            if (dueDay !== undefined && (dueDay < 1 || dueDay > 28))
                throw new Error('Dia de vencimento deve estar entre 1 e 28.');
            if (closingDay !== undefined && dueDay !== undefined && closingDay === dueDay)
                throw new Error('Dia de vencimento não pode ser igual ao dia de fechamento.');
            // Verifica existência de usuário e conta
            const user = yield Usuario_1.Usuario.findByPk(userId);
            if (!user)
                throw new Error('Usuário não encontrado.');
            const conta = yield Conta_1.Conta.findByPk(contaId);
            if (!conta)
                throw new Error('Conta não encontrada.');
            // Cria o cartão
            const novoCartao = yield Cartao_1.Cartao.create({
                userId,
                contaId,
                nome,
                type,
                creditLimit,
                creditUsed: 0,
                hasCashback,
                cashbackPercent,
                closingDay: closingDay !== null && closingDay !== void 0 ? closingDay : null, // garante null para débito
                dueDay: dueDay !== null && dueDay !== void 0 ? dueDay : null, // garante null para débito
                active,
            });
            return yield Cartao_1.Cartao.findByPk(novoCartao.id, { include: includeRelations });
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cartao_1.Cartao.findAll({ include: includeRelations });
        });
    }
    static findAllByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cartao_1.Cartao.findAll({ where: { userId }, include: includeRelations });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cartao_1.Cartao.findByPk(id, { include: includeRelations });
        });
    }
    static resumo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartao = yield Cartao_1.Cartao.findByPk(id, { include: includeRelations });
            if (!cartao)
                throw new Error('Cartão não encontrado.');
            const creditLimitNum = Number(cartao.creditLimit);
            const creditUsedNum = Number(cartao.creditUsed);
            const available = Math.max(0, creditLimitNum - creditUsedNum);
            const percentUsed = creditLimitNum > 0 ? +(creditUsedNum / creditLimitNum * 100).toFixed(2) : 0;
            const contaInstance = cartao.conta;
            const conta = contaInstance ? contaInstance.get({ plain: true }) : null;
            return {
                id: cartao.id,
                nome: cartao.nome,
                type: cartao.type,
                creditLimit: creditLimitNum,
                creditUsed: creditUsedNum,
                available,
                percentUsed,
                conta: Object.assign(Object.assign({}, conta), { saldo: (conta === null || conta === void 0 ? void 0 : conta.saldo) ? Number(conta.saldo) : 0 }),
            };
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartao = yield Cartao_1.Cartao.findByPk(id);
            if (!cartao)
                throw new Error('Cartão não encontrado.');
            if (data.creditLimit !== undefined && data.creditLimit < 0)
                throw new Error('Limite de crédito não pode ser negativo.');
            if (data.cashbackPercent !== undefined && (data.cashbackPercent < 0 || data.cashbackPercent > 100))
                throw new Error('Cashback deve estar entre 0 e 100%.');
            if (data.closingDay !== undefined && (data.closingDay < 1 || data.closingDay > 28))
                throw new Error('Dia de fechamento inválido.');
            if (data.dueDay !== undefined && (data.dueDay < 1 || data.dueDay > 28))
                throw new Error('Dia de vencimento inválido.');
            if (data.dueDay !== undefined && data.closingDay !== undefined && data.dueDay === data.closingDay) {
                throw new Error('Dia de vencimento não pode ser igual ao dia de fechamento.');
            }
            yield cartao.update(data);
            return yield Cartao_1.Cartao.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartao = yield Cartao_1.Cartao.findByPk(id);
            if (!cartao)
                throw new Error('Cartão não encontrado.');
            yield cartao.destroy(); // deleta o registro do banco
            return true;
        });
    }
}
exports.CartaoService = CartaoService;
