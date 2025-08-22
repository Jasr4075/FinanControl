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
const includeRelations = [
    { model: Fatura_1.Fatura.sequelize.models.Cartao, as: 'cartao', attributes: ['id', 'nome', 'type'] },
];
class FaturaService {
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
                paga,
                dataPagamento,
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
}
exports.FaturaService = FaturaService;
