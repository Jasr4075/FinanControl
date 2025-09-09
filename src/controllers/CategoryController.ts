import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { redisClient } from '../redisClient';

export const createCategoriesBulk = async (req: Request, res: Response) => {
  try {
    const categories = req.body;
    const inserted = await CategoryService.createBulk(categories);

    await redisClient.del('categories_all');

    res.status(201).json({ success: true, data: inserted });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'categories_all';

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log('⚡ Cache HIT - getCategories');
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const categories = await CategoryService.findAll();

    await redisClient.set(cacheKey, JSON.stringify(categories), { EX: 60 });
    console.log('💾 Cache SET - getCategories');

    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const cacheKey = `category_${id}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`⚡ Cache HIT - getCategoryById(${id})`);
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const category = await CategoryService.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });

    await redisClient.set(cacheKey, JSON.stringify(category), { EX: 60 });
    console.log(`💾 Cache SET - getCategoryById(${id})`);

    res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const category = await CategoryService.update(id, req.body.name);

    await redisClient.del('categories_all');
    await redisClient.del(`category_${id}`);

    res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    if (error.message === 'Categoria não encontrada.') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await CategoryService.delete(id);

    await redisClient.del('categories_all');
    await redisClient.del(`category_${id}`);

    res.status(200).json({ success: true, message: 'Categoria excluída com sucesso.' });
  } catch (error: any) {
    if (error.message === 'Categoria não encontrada.') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
