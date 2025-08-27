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
const FaturaService_1 = require("./FaturaService");
const includeRelations = [
    { model: Despesa_1.Despesa, as: 'despesa', attributes: ['id', 'descricao', 'valor'] },
    { model: Cartao_1.Cartao, as: 'cartao', attributes: ['id', 'nome', 'type'] },
    { model: Fatura_1.Fatura, as: 'fatura', attributes: ['id', 'mes', 'ano', 'valorTotal', 'paga'] },
];
class ParcelaService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { despesaId, cartaoId, numeroParcela, valor, dataVencimento } = data;
            if (!despesaId || !numeroParcela || !valor || !dataVencimento) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            // Se houver cartaoId devemos garantir a existência da fatura correspondente ao mês/ano da data de vencimento
            let faturaId = data.faturaId || null;
            if (cartaoId) {
                const mes = dataVencimento.getMonth() + 1; // JS month is 0-based
                const ano = dataVencimento.getFullYear();
                const fatura = yield FaturaService_1.FaturaService.findOrCreate(cartaoId, mes, ano);
                faturaId = fatura.id;
            }
            const createPayload = {
                despesaId,
                numeroParcela,
                valor,
                dataVencimento,
                faturaId,
                paga: (_a = data.paga) !== null && _a !== void 0 ? _a : false,
                dataPagamento: (_b = data.dataPagamento) !== null && _b !== void 0 ? _b : null,
            };
            if (cartaoId)
                createPayload.cartaoId = cartaoId;
            // Verifica duplicidade de numeroParcela na mesma despesa
            const existente = yield Parcela_1.Parcela.findOne({ where: { despesaId, numeroParcela } });
            if (existente) {
                throw new Error('Número de parcela já existe para esta despesa.');
            }
            const novaParcela = yield Parcela_1.Parcela.create(createPayload);
            // Atualiza o valorTotal da fatura após criar a parcela
            if (faturaId) {
                const fatura = yield Fatura_1.Fatura.findByPk(faturaId);
                if (fatura) {
                    fatura.valorTotal = Number(fatura.valorTotal || 0) + Number(valor);
                    yield fatura.save();
                }
            }
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
            const valorAntigo = Number(parcela.valor);
            const faturaAntiga = parcela.faturaId;
            // Se alterar numeroParcela verificar duplicidade
            if (data.numeroParcela && data.numeroParcela !== parcela.numeroParcela) {
                const dup = yield Parcela_1.Parcela.findOne({ where: { despesaId: parcela.despesaId, numeroParcela: data.numeroParcela } });
                if (dup)
                    throw new Error('Número de parcela já existe para esta despesa.');
            }
            yield parcela.update(data);
            // Ajustes de fatura/valorTotal
            if (parcela.faturaId) {
                const delta = Number(parcela.valor) - valorAntigo;
                if (delta !== 0) {
                    yield FaturaService_1.FaturaService.aplicarDelta(parcela.faturaId, delta);
                }
            }
            if (faturaAntiga && faturaAntiga !== parcela.faturaId) {
                // remove valor antigo da fatura anterior
                yield FaturaService_1.FaturaService.aplicarDelta(faturaAntiga, -valorAntigo);
            }
            return yield Parcela_1.Parcela.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcela = yield Parcela_1.Parcela.findByPk(id);
            if (!parcela)
                throw new Error('Parcela não encontrada.');
            const faturaId = parcela.faturaId;
            const valor = Number(parcela.valor);
            yield parcela.destroy();
            if (faturaId) {
                yield FaturaService_1.FaturaService.aplicarDelta(faturaId, -valor);
            }
            return true;
        });
    }
}
exports.ParcelaService = ParcelaService;
