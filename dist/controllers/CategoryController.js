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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategoriesBulk = void 0;
const CategoryService_1 = require("../services/CategoryService");
const redisClient_1 = require("../redisClient");
const createCategoriesBulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = req.body;
        const inserted = yield CategoryService_1.CategoryService.createBulk(categories);
        yield redisClient_1.redisClient.del('categories_all');
        res.status(201).json({ success: true, data: inserted });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createCategoriesBulk = createCategoriesBulk;
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = 'categories_all';
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            console.log('⚡ Cache HIT - getCategories');
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const categories = yield CategoryService_1.CategoryService.findAll();
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(categories), { EX: 60 });
        console.log('💾 Cache SET - getCategories');
        res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const cacheKey = `category_${id}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache HIT - getCategoryById(${id})`);
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const category = yield CategoryService_1.CategoryService.findById(id);
        if (!category)
            return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(category), { EX: 60 });
        console.log(`💾 Cache SET - getCategoryById(${id})`);
        res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCategoryById = getCategoryById;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const category = yield CategoryService_1.CategoryService.update(id, req.body.name);
        yield redisClient_1.redisClient.del('categories_all');
        yield redisClient_1.redisClient.del(`category_${id}`);
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
        const id = req.params.id;
        yield CategoryService_1.CategoryService.delete(id);
        yield redisClient_1.redisClient.del('categories_all');
        yield redisClient_1.redisClient.del(`category_${id}`);
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
