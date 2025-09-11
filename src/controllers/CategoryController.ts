import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { redisClient } from "../redisClient";

const CACHE_TTL = 86400;

async function refreshCategoryCache(categoryId?: string) {
  const allCategories = await CategoryService.findAll();
  await redisClient.set("categories_all", JSON.stringify(allCategories), { EX: CACHE_TTL });

  if (categoryId) {
    const category = await CategoryService.findById(categoryId);
    if (category) {
      await redisClient.set(`category_${categoryId}`, JSON.stringify(category), { EX: CACHE_TTL });
    } else {
      await redisClient.del(`category_${categoryId}`);
    }
  }
}

export const createCategoriesBulk = async (req: Request, res: Response) => {
  try {
    const categories = req.body;
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ success: false, message: "Nenhuma categoria enviada." });
    }

    const inserted = await CategoryService.createBulk(categories);

    await refreshCategoryCache();

    return res.status(201).json({ success: true, data: inserted });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "categories_all";
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const categories = await CategoryService.findAll();
    await redisClient.set(cacheKey, JSON.stringify(categories), { EX: CACHE_TTL });

    return res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const cacheKey = `category_${id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const category = await CategoryService.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Categoria não encontrada." });

    await redisClient.set(cacheKey, JSON.stringify(category), { EX: CACHE_TTL });

    return res.status(200).json({ success: true, data: category });
  } catch (error: any) {
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

    await refreshCategoryCache(id);

    return res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    if (error.message === "Categoria não encontrada.") {
      return res.status(404).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await CategoryService.delete(id);

    await refreshCategoryCache(id);

    return res.status(200).json({ success: true, message: "Categoria excluída com sucesso." });
  } catch (error: any) {
    if (error.message === "Categoria não encontrada.") {
      return res.status(404).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};
