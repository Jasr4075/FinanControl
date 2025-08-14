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

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor.';
  let detalhes = err.detalhes;

  // Sequelize ValidationError
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Erro de validação';
    detalhes = err.errors.map((e: any) => ({
      campo: e.path,
      mensagem: e.message,
    }));
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Erro de validação';
    detalhes = err.errors.map((e: any) => {
      let campo = e.path;
      let msg = 'Já está em uso';

      // Opcional: personalizar mensaje según campo
      if (campo === 'email') msg = 'Email já está em uso';
      if (campo === 'username') msg = 'Username já está em uso';
      if (campo === 'telefone') msg = 'Telefone já está em uso';

      return { campo, mensagem: msg };
    });
  }

  res.status(statusCode).json({ erro: message, detalhes });
}
