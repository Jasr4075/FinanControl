import { Request, Response, NextFunction } from 'express';
import { DespesaService } from '../services/DespesaService';
import { despesaCreateSchema, despesaUpdateSchema } from '../validators/despesa.schema';
import { z } from 'zod';
import { redisClient } from '../redisClient';

const CACHE_TTL_SHORT = 5;
const CACHE_TTL_LONG = 15;

// --- GET POR ID ---
export const getDespesaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = `despesa:${req.params.id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: JSON.parse(cached) });

    const despesa = await DespesaService.getById(req.params.id);
    if (!despesa) return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });

    await redisClient.setEx(cacheKey, CACHE_TTL_LONG, JSON.stringify(despesa));
    res.status(200).json({ success: true, data: despesa });
  } catch (error) {
    next(error);
  }
};

// --- ÚLTIMAS DESPESAS ---
export const getUltimasDespesas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const cacheKey = `ultimasDespesas:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: JSON.parse(cached) });

    const despesas = await DespesaService.getUltimas(userId, 15);
    await redisClient.setEx(cacheKey, CACHE_TTL_SHORT, JSON.stringify(despesas));
    res.status(200).json({ success: true, data: despesas });
  } catch (error) {
    next(error);
  }
};

// --- DESPESAS DO MÊS ATUAL ---
export const getDespesasMesAtual = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const cacheKey = `despesasMesAtual:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: JSON.parse(cached) });

    const despesas = await DespesaService.getMesAtual(userId);
    await redisClient.setEx(cacheKey, CACHE_TTL_SHORT, JSON.stringify(despesas));
    res.status(200).json({ success: true, data: despesas });
  } catch (error) {
    next(error);
  }
};

// --- TOTAL DE DESPESAS ---
export const getTotalDespesasMes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ano, mes } = req.query;
    const userId = req.params.userId;
    const cacheKey = ano && mes ? `totalDespesas:${userId}:${ano}-${mes}` : `totalDespesas:${userId}:mesAtual`;

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, total: Number(cached) });

    const total = ano && mes
      ? await DespesaService.getTotalByMonth(userId, Number(ano), Number(mes))
      : await DespesaService.getTotalMes(userId);

    await redisClient.setEx(cacheKey, CACHE_TTL_SHORT, total.toString());
    res.status(200).json({ success: true, total });
  } catch (error) {
    next(error);
  }
};

// --- CREATE ---
export const createDespesa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = despesaCreateSchema.parse(req.body);
    const despesa = await DespesaService.create(data);

    const userId = data.userId;
    // invalidar caches do usuário
    await redisClient.del(`ultimasDespesas:${userId}`);
    await redisClient.del(`despesasMesAtual:${userId}`);
    await redisClient.del(`totalDespesas:${userId}:mesAtual`);

    res.status(201).json({ success: true, data: despesa });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

// --- UPDATE ---
export const updateDespesa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = despesaUpdateSchema.parse(req.body);
    const despesa = await DespesaService.update(req.params.id, data);

    if (!despesa) return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });

    const userId = despesa.userId;
    // invalidar caches do usuário e do item específico
    await redisClient.del(`ultimasDespesas:${userId}`);
    await redisClient.del(`despesasMesAtual:${userId}`);
    await redisClient.del(`totalDespesas:${userId}:mesAtual`);
    await redisClient.del(`despesa:${req.params.id}`);

    res.status(200).json({ success: true, data: despesa });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

// --- DELETE ---
export const deleteDespesa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const despesa = await DespesaService.delete(req.params.id);
    if (!despesa) return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });

    const userId = despesa.userId;
    // invalidar caches do usuário e do item específico
    await redisClient.del(`ultimasDespesas:${userId}`);
    await redisClient.del(`despesasMesAtual:${userId}`);
    await redisClient.del(`totalDespesas:${userId}:mesAtual`);
    await redisClient.del(`despesa:${req.params.id}`);

    res.status(200).json({ success: true, message: 'Despesa excluída com sucesso.' });
  } catch (error) {
    next(error);
  }
};
