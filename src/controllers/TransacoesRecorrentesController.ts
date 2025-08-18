import { Request, Response, NextFunction } from 'express';
import { TransacoesRecorrentesService } from '../services/TransacoesRecorrentesService';
import { transacaoRecorrenteCreateSchema, transacaoRecorrenteUpdateSchema } from '../validators/transacoesRecorrentes.schema';
import { z } from 'zod';

// --- Criar transação recorrente ---
export const createTransacaoRecorrente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = transacaoRecorrenteCreateSchema.parse(req.body);
    const transacao = await TransacoesRecorrentesService.create(validated);
    res.status(201).json({ success: true, data: transacao });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Listar todas ---
export const getTransacoesRecorrentes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const transacoes = await TransacoesRecorrentesService.getAll();
    res.status(200).json({ success: true, data: transacoes });
  } catch (error) {
    next(error);
  }
};

// --- Buscar por ID ---
export const getTransacaoRecorrenteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transacao = await TransacoesRecorrentesService.getById(req.params.id);
    if (!transacao) return res.status(404).json({ success: false, message: 'Transação recorrente não encontrada.' });
    res.status(200).json({ success: true, data: transacao });
  } catch (error) {
    next(error);
  }
};

// --- Atualizar ---
export const updateTransacaoRecorrente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = transacaoRecorrenteUpdateSchema.parse(req.body);
    const transacao = await TransacoesRecorrentesService.update(req.params.id, validated);
    if (!transacao) return res.status(404).json({ success: false, message: 'Transação recorrente não encontrada.' });
    res.status(200).json({ success: true, data: transacao });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// --- Deletar ---
export const deleteTransacaoRecorrente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await TransacoesRecorrentesService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Transação recorrente não encontrada.' });
    res.status(200).json({ success: true, message: 'Transação recorrente excluída com sucesso.' });
  } catch (error) {
    next(error);
  }
};
