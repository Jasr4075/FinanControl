import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';

export function autenticarRequisicao(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ erro: 'Token ausente ou malformado.' });

  const token = authHeader.split(' ')[1];
  const payload = TokenService.verificarToken(token);
  if (!payload) return res.status(401).json({ erro: 'Token inválido ou expirado.' });

  (req as any).user = payload;
  next();
}
