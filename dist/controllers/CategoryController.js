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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const CategoryService_1 = require("../services/CategoryService");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ success: false, message: 'Nome da categoria é obrigatório.' });
        }
        if (!type) {
            return res.status(400).json({ success: false, message: 'Tipo da categoria é obrigatório.' });
        }
        const category = yield CategoryService_1.CategoryService.create(name, type);
        res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createCategory = createCategory;
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield CategoryService_1.CategoryService.findAll();
        res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield CategoryService_1.CategoryService.findById(req.params.id);
        if (!category)
            return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });
        res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCategoryById = getCategoryById;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type } = req.body;
    try {
        const category = yield CategoryService_1.CategoryService.update(req.params.id, name, type);
        res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        if (error.message === 'Categoria não encontrada.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CategoryService_1.CategoryService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Categoria excluída com sucesso.' });
    }
    catch (error) {
        if (error.message === 'Categoria não encontrada.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteCategory = deleteCategory;
