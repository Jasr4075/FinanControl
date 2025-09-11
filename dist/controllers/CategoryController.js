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
const CACHE_TTL = 86400;
function refreshCategoryCache(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        const allCategories = yield CategoryService_1.CategoryService.findAll();
        yield redisClient_1.redisClient.set("categories_all", JSON.stringify(allCategories), { EX: CACHE_TTL });
        if (categoryId) {
            const category = yield CategoryService_1.CategoryService.findById(categoryId);
            if (category) {
                yield redisClient_1.redisClient.set(`category_${categoryId}`, JSON.stringify(category), { EX: CACHE_TTL });
            }
            else {
                yield redisClient_1.redisClient.del(`category_${categoryId}`);
            }
        }
    });
}
const createCategoriesBulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = req.body;
        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ success: false, message: "Nenhuma categoria enviada." });
        }
        const inserted = yield CategoryService_1.CategoryService.createBulk(categories);
        yield refreshCategoryCache();
        return res.status(201).json({ success: true, data: inserted });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.createCategoriesBulk = createCategoriesBulk;
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = "categories_all";
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const categories = yield CategoryService_1.CategoryService.findAll();
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(categories), { EX: CACHE_TTL });
        return res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const cacheKey = `category_${id}`;
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const category = yield CategoryService_1.CategoryService.findById(id);
        if (!category)
            return res.status(404).json({ success: false, message: "Categoria não encontrada." });
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(category), { EX: CACHE_TTL });
        return res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCategoryById = getCategoryById;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const { name } = req.body;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ success: false, message: "Nome da categoria é obrigatório." });
        }
        const category = yield CategoryService_1.CategoryService.update(id, name);
        yield refreshCategoryCache(id);
        return res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        if (error.message === "Categoria não encontrada.") {
            return res.status(404).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        yield CategoryService_1.CategoryService.delete(id);
        yield refreshCategoryCache(id);
        return res.status(200).json({ success: true, message: "Categoria excluída com sucesso." });
    }
    catch (error) {
        if (error.message === "Categoria não encontrada.") {
            return res.status(404).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteCategory = deleteCategory;
