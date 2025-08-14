import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { AppError } from '../middlewares/errorHandler';

export const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const erros = result.error.issues.map((err: any) => ({
        campo: err.path.join('.'),
        mensagem: err.message,
      }));
      return next(new AppError('Erro de validação', 400, erros));
    }
    req.body = result.data;
    next();
  };
