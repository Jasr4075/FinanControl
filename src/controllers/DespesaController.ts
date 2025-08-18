import { Request, Response, NextFunction } from 'express';
import { DespesaService } from '../services/DespesaService';
import { despesaCreateSchema, despesaUpdateSchema } from '../validators/despesa.schema';
import { z } from 'zod';

// --- Criar despesa ---
export const createDespesa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const despesaValidated = despesaCreateSchema.parse(req.body);
    const despesa = await DespesaService.create(despesaValidated);
    res.status(201).json({ success: true, data: despesa });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Listar todas ---
export const getDespesas = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const despesas = await DespesaService.getAll();
    res.status(200).json({ success: true, data: despesas });
  } catch (error) {
    next(error);
  }
};

// --- Buscar por ID ---
export const getDespesaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const despesa = await DespesaService.getById(id);
    if (!despesa) return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
    res.status(200).json({ success: true, data: despesa });
  } catch (error) {
    next(error);
  }
};

// --- Atualizar despesa ---
export const updateDespesa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const despesaValidated = despesaUpdateSchema.parse(req.body);
    const despesaAtualizada = await DespesaService.update(id, despesaValidated);
    if (!despesaAtualizada) return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
    res.status(200).json({ success: true, data: despesaAtualizada });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Deletar despesa ---
export const deleteDespesa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await DespesaService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Despesa não encontrada.' });
    res.status(200).json({ success: true, message: 'Despesa excluída com sucesso.' });
  } catch (error) {
    next(error);
  }
};
