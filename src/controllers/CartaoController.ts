import { Request, Response, NextFunction } from 'express';
import { CartaoService } from '../services/CartaoService';
import { cartaoCreateSchema } from '../validators/cartao.schema';
import { z } from 'zod';

// --- Criar cartão ---
export const createCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = (req as any).user
    const userId = authUser?.id || authUser?.userId || authUser?.sub
    if (!userId) return res.status(400).json({ success: false, message: 'Usuário não identificado.' })
    // Força userId do token e ajusta tipos numéricos vindos como string
    const payload = {
      ...req.body,
      userId,
      creditLimit: req.body.creditLimit !== undefined ? Number(req.body.creditLimit) : undefined,
      cashbackPercent: req.body.cashbackPercent !== undefined ? Number(req.body.cashbackPercent) : undefined,
      closingDay: req.body.closingDay,
      dueDay: req.body.dueDay,
    }
    const validatedCartao = cartaoCreateSchema.parse(payload);
    const cartao = await CartaoService.create(validatedCartao);
    res.status(201).json({ success: true, data: cartao });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Listar todos os cartões ---
export const getCartoes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user
    const userId = user?.id || user?.userId || user?.sub
    if (!userId) return res.status(400).json({ success: false, message: 'Usuário não identificado no token.' })
    const cartoes = await CartaoService.findAllByUser(userId);
    res.status(200).json({ success: true, data: cartoes });
  } catch (error) {
    next(error);
  }
};

// --- Buscar cartão por ID ---
export const getCartaoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartao = await CartaoService.findById(req.params.id);
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
    res.status(200).json({ success: true, data: cartao });
  } catch (error) {
    next(error);
  }
};

export const getCartaoResumo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resumo = await CartaoService.resumo(req.params.id)
    res.status(200).json({ success: true, data: resumo })
  } catch (error) {
    next(error)
  }
};

// --- Atualizar cartão ---
export const updateCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Aqui você pode criar um schema de update opcional, se quiser validação parcial
    const cartao = await CartaoService.update(req.params.id, req.body);
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
    res.status(200).json({ success: true, data: cartao });
  } catch (error) {
    next(error);
  }
};

// --- Deletar cartão ---
export const deleteCartao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await CartaoService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' });
    res.status(200).json({ success: true, message: 'Cartão excluído com sucesso.' });
  } catch (error) {
    next(error);
  }
};
