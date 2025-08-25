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
exports.CategoryService = void 0;
const Category_1 = require("../models/Category");
class CategoryService {
    static createBulk(categories) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(categories) || categories.length === 0) {
                throw new Error('Debe enviar un array de categorías.');
            }
            return yield Category_1.Category.bulkCreate(categories);
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.Category.findAll();
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.Category.findByPk(id);
        });
    }
    static update(id, name, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name)
                throw new Error('Nome da categoria é obrigatório para atualização.');
            const category = yield Category_1.Category.findByPk(id);
            if (!category)
                throw new Error('Categoria não encontrada.');
            // Solo actualizamos type si se pasa
            yield category.update(Object.assign({ name }, (type && { type })));
            return category;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.Category.findByPk(id);
            if (!category)
                throw new Error('Categoria não encontrada.');
            yield category.destroy();
        });
    }
}
exports.CategoryService = CategoryService;
