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
exports.ParcelaService = void 0;
const Parcela_1 = require("../models/Parcela");
const Despesa_1 = require("../models/Despesa");
const Cartao_1 = require("../models/Cartao");
const Fatura_1 = require("../models/Fatura");
const includeRelations = [
    { model: Despesa_1.Despesa, as: 'despesa', attributes: ['id', 'descricao', 'valor'] },
    { model: Cartao_1.Cartao, as: 'cartao', attributes: ['id', 'nome', 'type'] },
    { model: Fatura_1.Fatura, as: 'fatura', attributes: ['id', 'mes', 'ano', 'valorTotal', 'paga'] },
];
class ParcelaService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { despesaId, cartaoId, numeroParcela, valor, dataVencimento } = data;
            if (!despesaId || !cartaoId || !numeroParcela || !valor || !dataVencimento) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            const novaParcela = yield Parcela_1.Parcela.create(Object.assign(Object.assign({}, data), { faturaId: (_a = data.faturaId) !== null && _a !== void 0 ? _a : null, paga: (_b = data.paga) !== null && _b !== void 0 ? _b : false, dataPagamento: (_c = data.dataPagamento) !== null && _c !== void 0 ? _c : null }));
            return yield Parcela_1.Parcela.findByPk(novaParcela.id, { include: includeRelations });
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Parcela_1.Parcela.findAll({ include: includeRelations });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Parcela_1.Parcela.findByPk(id, { include: includeRelations });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcela = yield Parcela_1.Parcela.findByPk(id);
            if (!parcela)
                throw new Error('Parcela não encontrada.');
            yield parcela.update(data);
            return yield Parcela_1.Parcela.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcela = yield Parcela_1.Parcela.findByPk(id);
            if (!parcela)
                throw new Error('Parcela não encontrada.');
            yield parcela.destroy();
        });
    }
}
exports.ParcelaService = ParcelaService;
