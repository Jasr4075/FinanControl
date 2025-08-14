import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  detalhes?: any;

  constructor(message: string, statusCode = 500, detalhes?: any) {
    super(message);
    this.statusCode = statusCode;
    this.detalhes = detalhes;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error('🔥 Erro capturado pelo middleware:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor.';

  res.status(statusCode).json({
    erro: message,
    detalhes: err.detalhes || undefined,
  });
}
