import { Request, Response, NextFunction } from 'express';
import { CartaoService } from '../services/CartaoService';
import { cartaoCreateSchema } from '../validators/cartao.schema';
import { z } from 'zod';
import { redisClient } from '../redisClient'; // assume que já tem cliente Redis configurado

const CACHE_TTL = 3600;

// --- Criar cartão ---
export const createCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = (req as any).user
    const userId = authUser?.id || authUser?.userId || authUser?.sub
    if (!userId) return res.status(400).json({ success: false, message: 'Usuário não identificado.' })

    const payload = {
      ...req.body,
      userId,
      creditLimit: req.body.creditLimit !== undefined ? Number(req.body.creditLimit) : undefined,
      cashbackPercent: req.body.cashbackPercent !== undefined ? Number(req.body.cashbackPercent) : undefined,
    }

    const validatedCartao = cartaoCreateSchema.parse(payload);
    const cartao = await CartaoService.create(validatedCartao);

    // Limpa cache do usuário, pois criamos um novo cartão
    await redisClient.del(`cartoes:${userId}`);

    res.status(201).json({ success: true, data: cartao });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

// --- Listar todos os cartões do usuário ---
export const getCartoes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?.userId || user?.sub;
    if (!userId) return res.status(400).json({ success: false, message: 'Usuário não identificado no token.' });

    const cacheKey = `cartoes:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: JSON.parse(cached) });

    const cartoes = await CartaoService.findAllByUser(userId);
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(cartoes));

    res.status(200).json({ success: true, data: cartoes });
  } catch (error) {
    next(error);
  }
};

// --- Buscar cartão por ID ---
export const getCartaoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = `cartao:${req.params.id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: JSON.parse(cached) });

    const cartao = await CartaoService.findById(req.params.id);
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(cartao));
    res.status(200).json({ success: true, data: cartao });
  } catch (error) {
    next(error);
  }
};

// --- Resumo do cartão ---
export const getCartaoResumo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = `cartaoResumo:${req.params.id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: JSON.parse(cached) });

    const resumo = await CartaoService.resumo(req.params.id);
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(resumo));
    res.status(200).json({ success: true, data: resumo });
  } catch (error) {
    next(error);
  }
};

// --- Atualizar cartão ---
export const updateCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartao = await CartaoService.update(req.params.id, req.body);
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });

    // Limpa cache do cartão e resumo
    await redisClient.del(`cartao:${req.params.id}`);
    await redisClient.del(`cartaoResumo:${req.params.id}`);
    await redisClient.del(`cartoes:${cartao.userId}`);

    res.status(200).json({ success: true, data: cartao });
  } catch (error) {
    next(error);
  }
};

// --- DELETE CARTÃO ---
export const deleteCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartao = await CartaoService.findById(req.params.id);
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });

    const userId = cartao.userId;

    // Deleta o cartão
    await CartaoService.delete(req.params.id);

    // Invalida caches relacionados
    await redisClient.del(`cartao:${req.params.id}`);
    await redisClient.del(`cartaoResumo:${req.params.id}`);
    if (userId) await redisClient.del(`cartoes:${userId}`);

    res.status(200).json({ success: true, message: 'Cartão excluído com sucesso.' });
  } catch (error) {
    next(error);
  }
};