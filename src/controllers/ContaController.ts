import { Request, Response, NextFunction } from 'express';
import { ContaService } from '../services/ContaService';
import { contaCreateSchema, contaUpdateSchema } from '../validators/conta.schema';
import { z } from 'zod';
import { redisClient } from '../redisClient';
import { CartaoService } from '../services/CartaoService';

const CACHE_TTL = 86400;

export async function refreshContaCache(contaId?: string, userId?: string) {
  if (contaId) {
    const conta = await ContaService.findById(contaId);
    if (conta) {
      await redisClient.set(`conta_${contaId}`, JSON.stringify(conta), { EX: CACHE_TTL });
    }
  }

  if (userId) {
    const contasUser = await ContaService.findByUserId(userId);
    await redisClient.set(`contas_user_${userId}`, JSON.stringify(contasUser), { EX: CACHE_TTL });
  }

  const contasAll = await ContaService.findAll();
  await redisClient.set('contas_all', JSON.stringify(contasAll), { EX: CACHE_TTL });
}

export const createConta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = contaCreateSchema.parse(req.body);
    const conta = await ContaService.create(data);

    await refreshContaCache(conta?.id, conta?.userId);

    res.status(201).json({ success: true, data: conta });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

export const getContas = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'contas_all';
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const contas = await ContaService.findAll();
    await redisClient.set(cacheKey, JSON.stringify(contas), { EX: CACHE_TTL });

    res.status(200).json({ success: true, data: contas });
  } catch (error) {
    next(error);
  }
};

export const getContaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const cacheKey = `conta_${id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const conta = await ContaService.findById(id);
    if (!conta) return res.status(404).json({ success: false, message: 'Conta não encontrada.' });

    await redisClient.set(cacheKey, JSON.stringify(conta), { EX: CACHE_TTL });

    res.status(200).json({ success: true, data: conta });
  } catch (error) {
    next(error);
  }
};

export const updateConta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = contaUpdateSchema.parse(req.body);
    const conta = await ContaService.update(req.params.id, data);

    if (!conta) {
      return res.status(404).json({ success: false, message: 'Conta não encontrada.' });
    }

    await refreshContaCache(req.params.id, conta.userId);

    res.status(200).json({ success: true, data: conta });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

export const deleteConta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conta = await ContaService.findById(req.params.id);
    if (!conta) return res.status(404).json({ success: false, message: 'Conta não encontrada.' });

    const userId = conta.userId;

    const cartoes = conta.cartoes || [];
    for (const cartao of cartoes) {
      await CartaoService.delete(cartao.id);
      await redisClient.del(`cartao:${cartao.id}`);
      await redisClient.del(`cartaoResumo:${cartao.id}`);
      await redisClient.del(`cartoes:${userId}`);

    }

    await ContaService.delete(req.params.id);

    await refreshContaCache(undefined, userId);

    await redisClient.del(`conta_${req.params.id}`);

    res.status(200).json({ success: true, message: 'Conta e cartões associados excluídos com sucesso.' });
  } catch (error) {
    next(error);
  }
};

export const getContasByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const cacheKey = `contas_user_${userId}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const contas = await ContaService.findByUserId(userId);
    await redisClient.set(cacheKey, JSON.stringify(contas), { EX: CACHE_TTL });

    res.status(200).json({ success: true, data: contas });
  } catch (error) {
    next(error);
  }
};
