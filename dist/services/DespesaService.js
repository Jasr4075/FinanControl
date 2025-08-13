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
const includeRelations = [
    { model: Usuario_1.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
    { model: Conta_1.Conta, as: 'conta', attributes: ['id', 'bancoNome'] },
    { model: Cartao_1.Cartao, as: 'cartao', attributes: ['id', 'nome'] },
    { model: Category_1.Category, as: 'categoria', attributes: ['id', 'name'] },
];
class DespesaService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, contaId, cartaoId, categoryId, descricao, valor, metodoPagamento, data: dataDespesa, parcelado, numeroParcelas, juros, observacoes } = data;
            if (!userId || !categoryId || !descricao || !valor || !metodoPagamento || !dataDespesa) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
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
            return { message: 'Despesa excluída com sucesso.' };
        });
    }
}
exports.DespesaService = DespesaService;
