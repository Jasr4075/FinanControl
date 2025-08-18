import { Request, Response, NextFunction } from 'express';
import { ContaService } from '../services/ContaService';
import { contaCreateSchema, contaUpdateSchema } from '../validators/conta.schema';
import { z } from 'zod';

export const createConta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // valida entrada com zod
    const data = contaCreateSchema.parse(req.body);

    const conta = await ContaService.create(data);
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
    const contas = await ContaService.findAll();
    res.status(200).json({ success: true, data: contas });
  } catch (error) {
    next(error);
  }
};

export const getContaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conta = await ContaService.findById(req.params.id);
    if (!conta) {
      return res.status(404).json({ success: false, message: 'Conta não encontrada.' });
    }
    res.status(200).json({ success: true, data: conta });
  } catch (error) {
    next(error);
  }
};

export const updateConta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // valida entrada com zod
    const data = contaUpdateSchema.parse(req.body);

    const conta = await ContaService.update(req.params.id, data);
    if (!conta) {
      return res.status(404).json({ success: false, message: 'Conta não encontrada.' });
    }

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
    const deleted = await ContaService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Conta não encontrada.' });
    }
    res.status(200).json({ success: true, message: 'Conta excluída com sucesso.' });
  } catch (error) {
    next(error);
  }
};
