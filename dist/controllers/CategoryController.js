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
const CACHE_TTL = 86400; // 86400 segundos (1 dia)
const createCategoriesBulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = req.body;
        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ success: false, message: "Nenhuma categoria enviada." });
        }
        const inserted = yield CategoryService_1.CategoryService.createBulk(categories);
        // ❌ Invalida cache global
        yield redisClient_1.redisClient.del("categories_all");
        console.log("♻️ Cache DEL - categories_all");
        return res.status(201).json({ success: true, data: inserted });
    }
    catch (error) {
        console.error("Erro em createCategoriesBulk:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.createCategoriesBulk = createCategoriesBulk;
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = "categories_all";
        const cached = yield redisClient_1.redisClient.get(cacheKey);
        if (cached) {
            console.log("⚡ Cache HIT - getCategories");
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const categories = yield CategoryService_1.CategoryService.findAll();
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(categories), { EX: CACHE_TTL });
        console.log("💾 Cache SET - getCategories");
        return res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        console.error("Erro em getCategories:", error);
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
            console.log(`⚡ Cache HIT - getCategoryById(${id})`);
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }
        const category = yield CategoryService_1.CategoryService.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Categoria não encontrada." });
        }
        yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(category), { EX: CACHE_TTL });
        console.log(`💾 Cache SET - getCategoryById(${id})`);
        return res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        console.error("Erro em getCategoryById:", error);
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
        // ❌ Invalida caches relacionados
        yield redisClient_1.redisClient.del("categories_all");
        yield redisClient_1.redisClient.del(`category_${id}`);
        console.log(`♻️ Cache DEL - categories_all & category_${id}`);
        return res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        if (error.message === "Categoria não encontrada.") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Erro em updateCategory:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        yield CategoryService_1.CategoryService.delete(id);
        // ❌ Invalida caches relacionados
        yield redisClient_1.redisClient.del("categories_all");
        yield redisClient_1.redisClient.del(`category_${id}`);
        console.log(`♻️ Cache DEL - categories_all & category_${id}`);
        return res.status(200).json({ success: true, message: "Categoria excluída com sucesso." });
    }
    catch (error) {
        if (error.message === "Categoria não encontrada.") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Erro em deleteCategory:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteCategory = deleteCategory;
