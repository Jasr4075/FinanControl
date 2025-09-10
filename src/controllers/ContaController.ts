import { Request, Response, NextFunction } from 'express';
import { ContaService } from '../services/ContaService';
import { contaCreateSchema, contaUpdateSchema } from '../validators/conta.schema';
import { z } from 'zod';
import { redisClient } from '../redisClient';

const CACHE_TTL = 86400; // 86400 segundos (1 dia)

export const createConta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = contaCreateSchema.parse(req.body);
    const conta = await ContaService.create(data);

    // Invalida cache global de contas
    await redisClient.del('contas_all');
    await redisClient.del(`contas_user_${data.userId}`);

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
      console.log('⚡ Cache HIT - getContas');
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const contas = await ContaService.findAll();
    await redisClient.set(cacheKey, JSON.stringify(contas), { EX: CACHE_TTL });
    console.log('💾 Cache SET - getContas');

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
      console.log(`⚡ Cache HIT - getContaById(${id})`);
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const conta = await ContaService.findById(id);
    if (!conta) return res.status(404).json({ success: false, message: 'Conta não encontrada.' });

    await redisClient.set(cacheKey, JSON.stringify(conta), { EX: CACHE_TTL });
    console.log(`💾 Cache SET - getContaById(${id})`);

    res.status(200).json({ success: true, data: conta });
  } catch (error) {
    next(error);
  }
};

export const updateConta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = contaUpdateSchema.parse(req.body);
    const conta = await ContaService.update(req.params.id, data);

    // Invalida cache
    await redisClient.del('contas_all');
    await redisClient.del(`conta_${req.params.id}`);
    if (conta?.userId) await redisClient.del(`contas_user_${conta.userId}`);

    res.status(200).json({ success: true, data: conta });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    if (error.message === 'Conta não encontrada.') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const deleteConta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conta = await ContaService.findById(req.params.id);
    if (!conta) return res.status(404).json({ success: false, message: 'Conta não encontrada.' });

    await ContaService.delete(req.params.id);

    // Invalida cache
    await redisClient.del('contas_all');
    await redisClient.del(`conta_${req.params.id}`);
    if (conta.userId) await redisClient.del(`contas_user_${conta.userId}`);

    res.status(200).json({ success: true, message: 'Conta excluída com sucesso.' });
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
      console.log(`⚡ Cache HIT - getContasByUserId(${userId})`);
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const contas = await ContaService.findByUserId(userId);
    await redisClient.set(cacheKey, JSON.stringify(contas), { EX: CACHE_TTL });
    console.log(`💾 Cache SET - getContasByUserId(${userId})`);

    res.status(200).json({ success: true, data: contas });
  } catch (error) {
    next(error);
  }
};
