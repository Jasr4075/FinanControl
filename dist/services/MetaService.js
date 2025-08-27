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
exports.MetaService = void 0;
const Meta_1 = require("../models/Meta");
const Despesa_1 = require("../models/Despesa");
const sequelize_1 = require("sequelize");
const includeRelations = [
    { model: Meta_1.Meta.sequelize.models.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
    { model: Meta_1.Meta.sequelize.models.Category, as: 'categoria', attributes: ['id', 'name'] },
];
class MetaService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuarioId, categoryId, limitAmount, month, year } = data;
            if (!usuarioId || !categoryId || !limitAmount || !month || !year) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            if (month < 1 || month > 12) {
                throw new Error('Mês inválido. Deve estar entre 1 e 12.');
            }
            const novaMeta = yield Meta_1.Meta.create({
                usuarioId,
                categoryId,
                limitAmount,
                month,
                year,
            });
            return yield Meta_1.Meta.findByPk(novaMeta.id, { include: includeRelations });
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Meta_1.Meta.findAll({ include: includeRelations });
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield Meta_1.Meta.findByPk(id, { include: includeRelations });
            if (!meta) {
                throw new Error('Meta não encontrada.');
            }
            return meta;
        });
    }
    static progresso(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield Meta_1.Meta.findByPk(id);
            if (!meta)
                throw new Error('Meta não encontrada.');
            const inicio = new Date(meta.year, meta.month - 1, 1);
            const fim = new Date(meta.year, meta.month, 0);
            const gasto = (yield Despesa_1.Despesa.sum('valor', {
                where: {
                    categoryId: meta.categoryId,
                    userId: meta.usuarioId,
                    data: { [sequelize_1.Op.between]: [inicio, fim] }
                }
            })) || 0;
            const limit = Number(meta.limitAmount);
            const percentual = limit > 0 ? +((Number(gasto) / limit) * 100).toFixed(2) : 0;
            return {
                metaId: meta.id,
                categoria: meta.categoryId,
                periodo: { mes: meta.month, ano: meta.year },
                limite: limit,
                gasto: Number(gasto),
                restante: Math.max(0, limit - Number(gasto)),
                percentual: percentual > 100 ? 100 : percentual,
                excedido: Number(gasto) > limit
            };
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const meta = yield Meta_1.Meta.findByPk(id);
            if (!meta) {
                throw new Error('Meta não encontrada.');
            }
            if (data.month && (data.month < 1 || data.month > 12)) {
                throw new Error('Mês inválido. Deve estar entre 1 e 12.');
            }
            yield meta.update({
                usuarioId: (_a = data.usuarioId) !== null && _a !== void 0 ? _a : meta.usuarioId,
                categoryId: (_b = data.categoryId) !== null && _b !== void 0 ? _b : meta.categoryId,
                limitAmount: (_c = data.limitAmount) !== null && _c !== void 0 ? _c : meta.limitAmount,
                month: (_d = data.month) !== null && _d !== void 0 ? _d : meta.month,
                year: (_e = data.year) !== null && _e !== void 0 ? _e : meta.year,
            });
            return yield Meta_1.Meta.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield Meta_1.Meta.findByPk(id);
            if (!meta) {
                throw new Error('Meta não encontrada.');
            }
            yield meta.destroy();
            return { message: 'Meta excluída com sucesso.' };
        });
    }
}
exports.MetaService = MetaService;
