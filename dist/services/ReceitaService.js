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
exports.ReceitaService = void 0;
const Receita_1 = require("../models/Receita");
const Usuario_1 = require("../models/Usuario");
const Conta_1 = require("../models/Conta");
const Category_1 = require("../models/Category");
const includeRelations = [
    { model: Usuario_1.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
    { model: Conta_1.Conta, as: 'contas', attributes: ['id', 'bancoNome', 'conta'] },
    { model: Category_1.Category, as: 'categories', attributes: ['id', 'name'] },
];
class ReceitaService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const receita = yield Receita_1.Receita.create(Object.assign(Object.assign({}, data), { nota: (_a = data.nota) !== null && _a !== void 0 ? _a : undefined }));
            return Receita_1.Receita.findByPk(receita.id, { include: includeRelations });
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return Receita_1.Receita.findAll({ include: includeRelations });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Receita_1.Receita.findByPk(id, { include: includeRelations });
        });
    }
    static update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const receita = yield Receita_1.Receita.findByPk(id);
            if (!receita)
                return null;
            yield receita.update(updates);
            return Receita_1.Receita.findByPk(id, { include: includeRelations });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const receita = yield Receita_1.Receita.findByPk(id);
            if (!receita)
                return null;
            yield receita.destroy();
            return true;
        });
    }
}
exports.ReceitaService = ReceitaService;
