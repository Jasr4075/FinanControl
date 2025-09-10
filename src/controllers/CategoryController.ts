import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { redisClient } from "../redisClient";

const CACHE_TTL = 86400; // 86400 segundos (1 dia)

export const createCategoriesBulk = async (req: Request, res: Response) => {
  try {
    const categories = req.body;
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ success: false, message: "Nenhuma categoria enviada." });
    }

    const inserted = await CategoryService.createBulk(categories);

    // ❌ Invalida cache global
    await redisClient.del("categories_all");

    console.log("♻️ Cache DEL - categories_all");
    return res.status(201).json({ success: true, data: inserted });
  } catch (error: any) {
    console.error("Erro em createCategoriesBulk:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "categories_all";

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Cache HIT - getCategories");
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const categories = await CategoryService.findAll();

    await redisClient.set(cacheKey, JSON.stringify(categories), { EX: CACHE_TTL });
    console.log("💾 Cache SET - getCategories");

    return res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    console.error("Erro em getCategories:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const cacheKey = `category_${id}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`⚡ Cache HIT - getCategoryById(${id})`);
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const category = await CategoryService.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Categoria não encontrada." });
    }

    await redisClient.set(cacheKey, JSON.stringify(category), { EX: CACHE_TTL });
    console.log(`💾 Cache SET - getCategoryById(${id})`);

    return res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    console.error("Erro em getCategoryById:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ success: false, message: "Nome da categoria é obrigatório." });
    }

    const category = await CategoryService.update(id, name);

    // ❌ Invalida caches relacionados
    await redisClient.del("categories_all");
    await redisClient.del(`category_${id}`);
    console.log(`♻️ Cache DEL - categories_all & category_${id}`);

    return res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    if (error.message === "Categoria não encontrada.") {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error("Erro em updateCategory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await CategoryService.delete(id);

    // ❌ Invalida caches relacionados
    await redisClient.del("categories_all");
    await redisClient.del(`category_${id}`);
    console.log(`♻️ Cache DEL - categories_all & category_${id}`);

    return res.status(200).json({ success: true, message: "Categoria excluída com sucesso." });
  } catch (error: any) {
    if (error.message === "Categoria não encontrada.") {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error("Erro em deleteCategory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
