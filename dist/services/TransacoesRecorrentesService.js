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
exports.TransacoesRecorrentesService = void 0;
const TransacoesRecorrentes_1 = require("../models/TransacoesRecorrentes");
const Usuario_1 = require("../models/Usuario");
const Category_1 = require("../models/Category");
const includeRelations = [
    { model: Usuario_1.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
    { model: Category_1.Category, as: 'categoria', attributes: ['id', 'name'] },
];
class TransacoesRecorrentesService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, type, amount, descricao, frequencia, dataInicio, dataFinal, active, categoryId } = data;
            if (!userId || !type || !amount || !descricao || !frequencia || !dataInicio || !categoryId) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            if (!['Despesa', 'Receita'].includes(type)) {
                throw new Error('Tipo inválido, use "Despesa" ou "Receita"');
            }
            if (!['diario', 'semanal', 'mensal'].includes(frequencia)) {
                throw new Error('Frequência inválida, use "diario", "semanal" ou "mensal"');
            }
            const novaTransacao = yield TransacoesRecorrentes_1.TransacoesRecorrentes.create({
                dataFinal: dataFinal !== null && dataFinal !== void 0 ? dataFinal : null,
                active: active !== null && active !== void 0 ? active : true,
                userId,
                type,
                amount,
                descricao,
                frequencia,
                dataInicio,
                categoryId
            });
            return yield TransacoesRecorrentes_1.TransacoesRecorrentes.findByPk(novaTransacao.id, { include: includeRelations });
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TransacoesRecorrentes_1.TransacoesRecorrentes.findAll({ include: includeRelations });
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transacao = yield TransacoesRecorrentes_1.TransacoesRecorrentes.findByPk(id, { include: includeRelations });
            if (!transacao) {
                throw new Error('Transação recorrente não encontrada.');
            }
            return transacao;
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transacao = yield TransacoesRecorrentes_1.TransacoesRecorrentes.findByPk(id);
            if (!transacao) {
                throw new Error('Transação recorrente não encontrada.');
            }
            yield transacao.update(data);
            return yield TransacoesRecorrentes_1.TransacoesRecorrentes.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transacao = yield TransacoesRecorrentes_1.TransacoesRecorrentes.findByPk(id);
            if (!transacao) {
                throw new Error('Transação recorrente não encontrada.');
            }
            yield transacao.destroy();
            return { message: 'Transação recorrente excluída com sucesso.' };
        });
    }
}
exports.TransacoesRecorrentesService = TransacoesRecorrentesService;
