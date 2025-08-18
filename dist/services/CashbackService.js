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
const includeRelations = [
    { model: Cartao_1.Cartao, as: 'cartao', attributes: ['id', 'nome'] },
    { model: Despesa_1.Despesa, as: 'despesa', attributes: ['id', 'descricao', 'valor'] },
];
class CashbackService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cartaoId, quantidade, description, despesaId, creditDate } = data;
            if (!cartaoId || !quantidade || !description || !despesaId || !creditDate) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            const novoCashback = yield Cashback_1.Cashback.create({
                cartaoId,
                quantidade,
                description,
                despesaId,
                creditDate,
            });
            return yield Cashback_1.Cashback.findByPk(novoCashback.id, { include: includeRelations });
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
