import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/UsuarioService';

export const createUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = await UsuarioService.create(req.body);
    res.status(201).json({ success: true, data: usuario });
  } catch (err) {
    next(err);
  }
};

export const getUsuarios = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarios = await UsuarioService.findAll();
    res.status(200).json({ success: true, data: usuarios });
  } catch (err) {
    next(err);
  }
};

export const getUsuarioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = await UsuarioService.findById(req.params.id);
    res.status(200).json({ success: true, data: usuario });
  } catch (err) {
    next(err);
  }
};

export const updateUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = await UsuarioService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: usuario });
  } catch (err) {
    next(err);
  }
};

export const deleteUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UsuarioService.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Usuário excluído com sucesso.' });
  } catch (err) {
    next(err);
  }
};
