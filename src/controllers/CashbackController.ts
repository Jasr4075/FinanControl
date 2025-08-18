import { Request, Response, NextFunction } from 'express';
import { CashbackService } from '../services/CashbackService';
import { cashbackCreateSchema, cashbackUpdateSchema } from '../validators/cashback.schema';
import { z } from 'zod';

// --- Criar cashback ---
export const createCashback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedCashback = cashbackCreateSchema.parse(req.body);
    const cashback = await CashbackService.create(validatedCashback);
    res.status(201).json({ success: true, data: cashback });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Listar todos ---
export const getCashbacks = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cashbacks = await CashbackService.findAll();
    res.status(200).json({ success: true, data: cashbacks });
  } catch (error) {
    next(error);
  }
};

// --- Buscar por ID ---
export const getCashbackById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cashback = await CashbackService.findById(req.params.id);
    if (!cashback) return res.status(404).json({ success: false, message: 'Cashback não encontrado.' });
    res.status(200).json({ success: true, data: cashback });
  } catch (error) {
    next(error);
  }
};

// --- Atualizar ---
export const updateCashback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedCashback = cashbackUpdateSchema.parse(req.body);
    const cashback = await CashbackService.update(req.params.id, validatedCashback);
    if (!cashback) return res.status(404).json({ success: false, message: 'Cashback não encontrado.' });
    res.status(200).json({ success: true, data: cashback });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Deletar ---
export const deleteCashback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await CashbackService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Cashback não encontrado.' });
    res.status(200).json({ success: true, message: 'Cashback excluído com sucesso.' });
  } catch (error) {
    next(error);
  }
};
