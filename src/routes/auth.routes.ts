import { Router } from 'express';
import { loginUsuario, registerUsuario } from '../controllers/AuthController';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(3),
  senha: z.string().min(6),
});

const registerSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().min(8),
  username: z.string().min(3),
  senha: z.string().min(6),
});

router.post('/login', validate(loginSchema), loginUsuario);
router.post('/register', validate(registerSchema), registerUsuario);

export default router;
