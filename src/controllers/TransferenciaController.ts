import { Request, Response, NextFunction } from 'express';
import { transferenciaService } from '../services/TransferenciaService';
import { transferenciaCreateSchema, transferenciaUpdateSchema } from '../validators/transferencia.schema';
import { z } from 'zod';

// --- Criar transferência ---
export const createTransferencia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = transferenciaCreateSchema.parse(req.body);
    const transferencia = await transferenciaService.create(validated);
    res.status(201).json({ success: true, data: transferencia });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Listar todas ---
export const getTransferencias = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const transferencias = await transferenciaService.getAll();
    res.status(200).json({ success: true, data: transferencias });
  } catch (error) {
    next(error);
  }
};

// --- Buscar por ID ---
export const getTransferenciaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transferencia = await transferenciaService.getById(req.params.id);
    if (!transferencia) return res.status(404).json({ success: false, message: 'Transferência não encontrada.' });
    res.status(200).json({ success: true, data: transferencia });
  } catch (error) {
    next(error);
  }
};

// --- Atualizar ---
export const updateTransferencia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = transferenciaUpdateSchema.parse(req.body);
    const transferencia = await transferenciaService.update(req.params.id, validated);
    if (!transferencia) return res.status(404).json({ success: false, message: 'Transferência não encontrada.' });
    res.status(200).json({ success: true, data: transferencia });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Deletar ---
export const deleteTransferencia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await transferenciaService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Transferência não encontrada.' });
    res.status(200).json({ success: true, message: 'Transferência excluída com sucesso.' });
  } catch (error) {
    next(error);
  }
};
