import { Request, Response, NextFunction } from 'express';
import { CartaoService } from '../services/CartaoService';
import { cartaoCreateSchema } from '../validators/cartao.schema';
import { z } from 'zod';
import { redisClient } from '../redisClient';

const CACHE_TTL = 3600;

async function refreshCartaoCache(cartaoId?: string, userId?: string) {
  if (cartaoId) {
    const cartao = await CartaoService.findById(cartaoId);
    if (cartao) {
      await redisClient.set(`cartao:${cartaoId}`, JSON.stringify(cartao), { EX: CACHE_TTL });

      const resumo = await CartaoService.resumo(cartaoId);
      await redisClient.set(`cartaoResumo:${cartaoId}`, JSON.stringify(resumo), { EX: CACHE_TTL });
    }
  }

  if (userId) {
    const cartoes = await CartaoService.findAllByUser(userId);
    await redisClient.set(`cartoes:${userId}`, JSON.stringify(cartoes), { EX: CACHE_TTL });
  }
}

export const createCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = (req as any).user;
    const userId = authUser?.id || authUser?.userId || authUser?.sub;
    if (!userId) return res.status(400).json({ success: false, message: 'Usuário não identificado.' });

    const payload = {
      ...req.body,
      userId,
      creditLimit: req.body.creditLimit !== undefined ? Number(req.body.creditLimit) : undefined,
      cashbackPercent: req.body.cashbackPercent !== undefined ? Number(req.body.cashbackPercent) : undefined,
    };

    const validatedCartao = cartaoCreateSchema.parse(payload);
    const cartao = await CartaoService.create(validatedCartao);

    await refreshCartaoCache(cartao?.id, userId);

    res.status(201).json({ success: true, data: cartao });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

export const getCartoes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?.userId || user?.sub;
    if (!userId) return res.status(400).json({ success: false, message: 'Usuário não identificado no token.' });

    const cacheKey = `cartoes:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const cartoes = await CartaoService.findAllByUser(userId);
    await redisClient.set(cacheKey, JSON.stringify(cartoes), { EX: CACHE_TTL });

    res.status(200).json({ success: true, data: cartoes });
  } catch (error) {
    next(error);
  }
};

export const getCartaoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = `cartao:${req.params.id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const cartao = await CartaoService.findById(req.params.id);
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });

    await redisClient.set(cacheKey, JSON.stringify(cartao), { EX: CACHE_TTL });

    res.status(200).json({ success: true, data: cartao });
  } catch (error) {
    next(error);
  }
};

export const getCartaoResumo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = `cartaoResumo:${req.params.id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached) });
    }

    const resumo = await CartaoService.resumo(req.params.id);
    await redisClient.set(cacheKey, JSON.stringify(resumo), { EX: CACHE_TTL });

    res.status(200).json({ success: true, data: resumo });
  } catch (error) {
    next(error);
  }
};

export const updateCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartao = await CartaoService.update(req.params.id, req.body);
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });

    await refreshCartaoCache(cartao.id, cartao.userId);

    res.status(200).json({ success: true, data: cartao });
  } catch (error) {
    next(error);
  }
};

export const deleteCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartao = await CartaoService.findById(req.params.id);
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });

    const userId = cartao.userId;

    await CartaoService.delete(req.params.id);

    await refreshCartaoCache(undefined, userId);

    await redisClient.del(`cartao:${req.params.id}`);
    await redisClient.del(`cartaoResumo:${req.params.id}`);

    res.status(200).json({ success: true, message: 'Cartão excluído com sucesso.' });
  } catch (error) {
    next(error);
  }
};
