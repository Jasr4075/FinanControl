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
    { model: Conta_1.Conta, as: 'conta', attributes: ['id', 'bancoNome', 'agencia', 'conta'] },
];
class CartaoService {
    // Cria um cartão validando campos obrigatórios e aplicando defaults
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, contaId, nome, type, creditLimit = 0, hasCashback = false, cashbackPercent = 0, closingDay, dueDay, active = true, } = data;
            if (!userId || !contaId || !nome || !type || closingDay === undefined || dueDay === undefined) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            const novoCartao = yield Cartao_1.Cartao.create({
                userId,
                contaId,
                nome,
                type,
                creditLimit,
                hasCashback,
                cashbackPercent,
                closingDay,
                dueDay,
                active,
            });
            return yield Cartao_1.Cartao.findByPk(novoCartao.id, { include: includeRelations });
        });
    }
    // Retorna todos os cartões com relações
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cartao_1.Cartao.findAll({ include: includeRelations });
        });
    }
    // Busca cartão por ID com relações
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cartao_1.Cartao.findByPk(id, { include: includeRelations });
        });
    }
    // Atualiza cartão por ID e retorna atualizado com relações
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartao = yield Cartao_1.Cartao.findByPk(id);
            if (!cartao)
                throw new Error('Cartão não encontrado.');
            yield cartao.update(data);
            return yield Cartao_1.Cartao.findByPk(id, { include: includeRelations });
        });
    }
    // Remove cartão por ID
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartao = yield Cartao_1.Cartao.findByPk(id);
            if (!cartao)
                throw new Error('Cartão não encontrado.');
            yield cartao.destroy();
        });
    }
}
exports.CartaoService = CartaoService;
